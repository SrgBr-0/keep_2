import { remult as defaultRemult } from '../src/remult-proxy.js';
import pg from 'pg';
const { Pool } = pg;
import { Remult } from '../src/context.js';
import { SqlDatabase } from '../src/data-providers/sql-database.js';
import { PostgresSchemaBuilder } from './schema-builder.js';
export class PostgresDataProvider {
    pool;
    options;
    supportsJsonColumnType = true;
    static getDb(dataProvider) {
        const r = (dataProvider || defaultRemult.dataProvider);
        if (!r._getSourceSql)
            throw 'the data provider is not an SqlDatabase';
        const me = r._getSourceSql();
        if (!me.pool) {
            throw 'the data provider is not a PostgresDataProvider';
        }
        return me.pool;
    }
    async entityIsUsedForTheFirstTime(entity) { }
    getLimitSqlSyntax(limit, offset) {
        return ' limit ' + limit + ' offset ' + offset;
    }
    createCommand() {
        return new PostgresBridgeToSQLCommand(this.pool);
    }
    constructor(pool, options) {
        this.pool = pool;
        this.options = options;
        if (options?.wrapIdentifier)
            this.wrapIdentifier = options.wrapIdentifier;
        if (!options?.wrapIdentifier && options?.caseInsensitiveIdentifiers)
            this.wrapIdentifier = (name) => name;
        if (options?.orderByNullsFirst)
            this.orderByNullsFirst = options.orderByNullsFirst;
        if (options?.schema) {
            this.pool = new PostgresSchemaWrapper(pool, options.schema);
        }
    }
    end() {
        return this.pool.end();
    }
    provideMigrationBuilder(builder) {
        var db = new SqlDatabase(this);
        var sb = new PostgresSchemaBuilder(db, this.options?.schema);
        return {
            addColumn: async (meta, field) => {
                builder.addSql(await sb.getAddColumnScript(meta, field));
            },
            createTable: async (meta) => {
                builder.addSql(await sb.createTableScript(meta));
            },
        };
    }
    wrapIdentifier = (name) => name
        .split('.')
        .map((name) => name.startsWith('"') ? name : '"' + name.replace(/"/g, '""') + '"')
        .join('.');
    async ensureSchema(entities) {
        var db = new SqlDatabase(this);
        var sb = new PostgresSchemaBuilder(db, this.options?.schema);
        await sb.ensureSchema(entities);
    }
    orderByNullsFirst;
    async transaction(action) {
        let client = await this.pool.connect();
        try {
            await client.query('BEGIN');
            await action({
                createCommand: () => new PostgresBridgeToSQLCommand(client),
                entityIsUsedForTheFirstTime: this.entityIsUsedForTheFirstTime,
                transaction: () => {
                    throw 'nested transactions not allowed';
                },
                getLimitSqlSyntax: this.getLimitSqlSyntax,
                supportsJsonColumnType: this.supportsJsonColumnType,
                //@ts-ignore
                pool: client,
                wrapIdentifier: this.wrapIdentifier,
                orderByNullsFirst: this.orderByNullsFirst,
            });
            await client.query('COMMIT');
        }
        catch (err) {
            await client.query('ROLLBACK');
            throw err;
        }
        finally {
            await client.release();
        }
    }
}
class PostgresBridgeToSQLCommand {
    source;
    constructor(source) {
        this.source = source;
    }
    values = [];
    addParameterAndReturnSqlToken(val) {
        return this.param(val);
    }
    param(val) {
        if (Array.isArray(val))
            val = JSON.stringify(val);
        this.values.push(val);
        return '$' + this.values.length;
    }
    async execute(sql) {
        return this.source
            .query(sql, this.values)
            .then((r) => new PostgresBridgeToSQLQueryResult(r));
    }
}
class PostgresBridgeToSQLQueryResult {
    r;
    getColumnKeyInResultForIndexInSelect(index) {
        return this.r.fields[index].name;
    }
    constructor(r) {
        this.r = r;
        this.rows = r.rows;
    }
    rows;
}
export async function createPostgresConnection(options) {
    return createPostgresDataProvider(options);
}
export async function createPostgresDataProvider(options) {
    if (!options)
        options = {};
    let config = {};
    if (options.configuration)
        if (options.configuration == 'heroku') {
            config = {
                connectionString: process.env.DATABASE_URL,
                ssl: process.env.NODE_ENV !== 'production' && !options.sslInDev
                    ? false
                    : {
                        rejectUnauthorized: false,
                    },
            };
        }
        else
            config = options.configuration;
    else {
        if (!options.connectionString)
            options.connectionString = process.env.DATABASE_URL;
    }
    if (!config.connectionString && options.connectionString) {
        config.connectionString = options.connectionString;
    }
    const db = new SqlDatabase(new PostgresDataProvider(new Pool(config), {
        wrapIdentifier: options.wrapIdentifier,
        caseInsensitiveIdentifiers: options.caseInsensitiveIdentifiers,
        schema: options.schema,
        orderByNullsFirst: options.orderByNullsFirst,
    }));
    return db;
}
export async function preparePostgresQueueStorage(sql) {
    let c = new Remult();
    c.dataProvider = sql;
    let JobsInQueueEntity = (await import('../server/remult-api-server.js'))
        .JobsInQueueEntity;
    let e = c.repo(JobsInQueueEntity);
    await sql.ensureSchema([e.metadata]);
    return new (await import('../server/remult-api-server.js')).EntityQueueStorage(c.repo(JobsInQueueEntity));
}
export class PostgresSchemaWrapper {
    pool;
    schema;
    constructor(pool, schema) {
        this.pool = pool;
        this.schema = schema;
    }
    async connect() {
        let r = await this.pool.connect();
        await r.query('set search_path to ' + this.schema);
        return r;
    }
    async query(queryText, values) {
        let c = await this.connect();
        try {
            return await c.query(queryText, values);
        }
        finally {
            c.release();
        }
    }
    end() {
        return this.pool.end();
    }
}

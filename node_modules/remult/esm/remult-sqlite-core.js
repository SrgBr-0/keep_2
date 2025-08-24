import { SqlDatabase } from './src/data-providers/sql-database.js';
import { dbNamesOf, shouldNotCreateField, } from './src/filter/filter-consumer-bridge-to-sql-request.js';
import { isAutoIncrement } from './src/remult3/RepositoryImplementation.js';
export class SqliteCoreDataProvider {
    createCommand;
    end;
    doesNotSupportReturningSyntax;
    doesNotSupportReturningSyntaxOnlyForUpdate;
    constructor(createCommand, end, doesNotSupportReturningSyntax = false, doesNotSupportReturningSyntaxOnlyForUpdate = false) {
        this.createCommand = createCommand;
        this.end = end;
        this.doesNotSupportReturningSyntax = doesNotSupportReturningSyntax;
        this.doesNotSupportReturningSyntaxOnlyForUpdate = doesNotSupportReturningSyntaxOnlyForUpdate;
    }
    orderByNullsFirst;
    getLimitSqlSyntax(limit, offset) {
        return ' limit ' + limit + ' offset ' + offset;
    }
    afterMutation;
    provideMigrationBuilder(builder) {
        let self = this;
        return {
            createTable: async (entity) => {
                await (await self.getCreateTableSql(entity)).map(builder.addSql);
            },
            addColumn: async (entity, field) => {
                let e = await dbNamesOf(entity, this.wrapIdentifier);
                let sql = `alter table ${e.$entityName} add column ${self.addColumnSqlSyntax(field, e.$dbNameOf(field), true)}`;
                builder.addSql(sql);
            },
        };
    }
    async transaction(action) {
        await this.createCommand().execute('Begin Transaction');
        try {
            await action(this);
            await this.createCommand().execute('Commit');
        }
        catch (err) {
            await this.createCommand().execute('Rollback');
            throw err;
        }
    }
    async entityIsUsedForTheFirstTime(entity) { }
    async ensureSchema(entities) {
        for (const entity of entities) {
            await this.createTableIfNotExist(entity);
            await this.verifyAllColumns(entity);
        }
    }
    async verifyAllColumns(entity) {
        try {
            let cmd = this.createCommand();
            let e = await dbNamesOf(entity, this.wrapIdentifier);
            let cols = (await cmd.execute(`PRAGMA table_info(${e.$entityName})`)).rows.map((x) => this.wrapIdentifier(x.name.toLocaleLowerCase()));
            for (const col of entity.fields) {
                if (!shouldNotCreateField(col, e)) {
                    let colName = e.$dbNameOf(col).toLocaleLowerCase();
                    if (!cols.includes(colName)) {
                        let sql = `ALTER table ${e.$entityName} ` +
                            `add column ${this.addColumnSqlSyntax(col, e.$dbNameOf(col), true)}`;
                        await this.createCommand().execute(sql);
                    }
                }
            }
        }
        catch (err) {
            console.error(err);
        }
    }
    async dropTable(entity) {
        let e = await dbNamesOf(entity, this.wrapIdentifier);
        let sql = 'drop  table if exists ' + e.$entityName;
        if (SqlDatabase.LogToConsole)
            console.info(sql);
        await this.createCommand().execute(sql);
    }
    addColumnSqlSyntax(x, dbName, isAlterTable) {
        let result = dbName;
        const nullNumber = x.allowNull ? '' : ' default 0 not null';
        if (x.valueType == Date)
            result += ' integer';
        else if (x.valueType == Boolean)
            result += ' integer ' + nullNumber;
        else if (x.valueType == Number) {
            if (!x.valueConverter.fieldTypeInDb)
                result += ' numeric ' + nullNumber;
            else
                result += ' ' + x.valueConverter.fieldTypeInDb + ' ' + nullNumber;
        }
        else
            result += ' text' + (x.allowNull ? ' ' : " default '' not null ");
        return result;
    }
    async createTableIfNotExist(entity) {
        let sql = await this.getCreateTableSql(entity);
        for (const element of sql) {
            await this.createCommand().execute(element);
        }
    }
    supportsJsonColumnType;
    async getCreateTableSql(entity) {
        let result = '';
        let e = await dbNamesOf(entity, this.wrapIdentifier);
        for (const x of entity.fields) {
            if (!shouldNotCreateField(x, e) || isAutoIncrement(x)) {
                if (result.length != 0)
                    result += ',';
                result += '\r\n  ';
                if (isAutoIncrement(x)) {
                    if (x.key != entity.idMetadata.field.key)
                        throw 'in sqlite, autoincrement is only allowed for primary key';
                    result += e.$dbNameOf(x) + ' integer primary key autoincrement';
                }
                else {
                    result += this.addColumnSqlSyntax(x, e.$dbNameOf(x), false);
                    if (x.key == entity.idMetadata.field.key) {
                        result += ' primary key';
                    }
                }
            }
        }
        let sql = [
            'create table if not exists ' + e.$entityName + ' (' + result + '\r\n)',
        ];
        if (entity.idMetadata.fields.length > 1) {
            sql.push(`create unique index if not exists ${this.wrapIdentifier(entity.dbName + '_primary_key')} on ${e.$entityName}  (${entity.idMetadata.fields
                .map((x) => e.$dbNameOf(x))
                .join(',')})`);
        }
        return sql;
    }
    wrapIdentifier(name) {
        //return name
        return '`' + name + '`';
    }
}

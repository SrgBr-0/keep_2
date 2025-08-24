import { SqliteCoreDataProvider } from './remult-sqlite-core.js';
import { ValueConverters, dbNamesOf, } from './index.js';
import { shouldNotCreateField } from './src/filter/filter-consumer-bridge-to-sql-request.js';
import { isAutoIncrement } from './src/remult3/RepositoryImplementation.js';
export class DuckDBDataProvider extends SqliteCoreDataProvider {
    constructor(db) {
        super(() => new DuckDBCommand(db), async () => (await db).close(), false, true);
    }
    wrapIdentifier(name) {
        return `"${name}"`;
    }
    async getCreateTableSql(entity) {
        let result = '';
        let e = await dbNamesOf(entity, this.wrapIdentifier);
        let sql = '';
        for (const x of entity.fields) {
            if (!shouldNotCreateField(x, e) || isAutoIncrement(x)) {
                if (result.length != 0)
                    result += ',';
                result += '\r\n  ';
                if (isAutoIncrement(x)) {
                    const sequenceName = `${entity.dbName}_${x.dbName}_seq`;
                    sql += `create sequence if not exists "${sequenceName}";\r\n`;
                    result += `${e.$dbNameOf(x)} integer default nextval('${sequenceName}')`;
                }
                else {
                    result += this.addColumnSqlSyntax(x, e.$dbNameOf(x), false);
                }
            }
        }
        result += `,\r\n   primary key (${entity.idMetadata.fields
            .map((f) => e.$dbNameOf(f))
            .join(',')})`;
        sql +=
            'create table if not exists ' + e.$entityName + ' (' + result + '\r\n)';
        return [sql];
    }
    addColumnSqlSyntax(x, dbName, isAlterColumn) {
        let result = dbName;
        var allowNull = x.allowNull;
        if (!allowNull && isAlterColumn) {
            allowNull = true;
            console.log('DuckDB does not support altering columns to allow null on existing tables');
        }
        if (x.valueType == Number) {
            if (!x.valueConverter.fieldTypeInDb)
                result += ' numeric' + (allowNull ? '' : ' default 0 not null');
            else
                result +=
                    ' ' +
                        x.valueConverter.fieldTypeInDb +
                        (allowNull ? '' : ' default 0 not null');
        }
        else if (x.valueType == Date) {
            if (!x.valueConverter.fieldTypeInDb)
                if (x.valueConverter == ValueConverters.DateOnly)
                    result += ' date';
                else
                    result += ' timestamp';
            else
                result += ' ' + x.valueConverter.fieldTypeInDb;
        }
        else if (x.valueType == Boolean)
            result += ' boolean' + (allowNull ? '' : ' default false not null');
        else if (x.valueConverter.fieldTypeInDb) {
            result += ' ' + x.valueConverter.fieldTypeInDb;
            if (!allowNull && x.valueConverter.fieldTypeInDb == 'integer') {
                result += ' default 0 not null';
            }
        }
        else
            result += ' varchar' + (allowNull ? '' : " default '' not null");
        return result;
    }
}
class DuckDBCommand {
    db;
    values = [];
    constructor(db) {
        this.db = db;
    }
    async execute(sql) {
        return new Promise((resolve, error) => {
            this.db.all(sql, ...this.values, (err, rows) => {
                if (err)
                    error(err);
                else
                    resolve(new DuckDBSqlResult(rows));
            });
        });
    }
    addParameterAndReturnSqlToken(val) {
        return this.param(val);
    }
    param(val) {
        const key = '?';
        this.values.push(val);
        return key;
    }
}
class DuckDBSqlResult {
    result;
    constructor(result) {
        this.result = result;
        this.rows = result;
    }
    rows;
    getColumnKeyInResultForIndexInSelect(index) {
        return Object.keys(this.result[0])[index];
    }
}

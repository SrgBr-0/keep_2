import { SqlDatabase } from './index.js';
import { SqliteCoreDataProvider } from './remult-sqlite-core.js';
export async function createSqlite3DataProvider(fileName = ':memory:') {
    const sqlite3 = await import('sqlite3');
    return new SqlDatabase(new Sqlite3DataProvider(new sqlite3.default.Database(fileName)));
}
export class Sqlite3DataProvider extends SqliteCoreDataProvider {
    constructor(db) {
        super(() => new Sqlite3Command(db), async () => {
            db.close();
        }, true);
    }
}
class Sqlite3Command {
    db;
    values = {};
    i = 1;
    constructor(db) {
        this.db = db;
    }
    async execute(sql) {
        return new Promise((resolve, error) => {
            if (sql.startsWith('insert into')) {
                this.db.run(sql, this.values, function (err, rows) {
                    if (err)
                        error(err);
                    else
                        resolve(new Sqlite3SqlResult([
                            //@ts-expect-error last id comes from sql lite as a lastId member of the function this
                            this.lastID,
                        ]));
                });
            }
            else
                this.db.all(sql, this.values, (err, rows) => {
                    if (err)
                        error(err);
                    else
                        resolve(new Sqlite3SqlResult(rows));
                });
        });
    }
    addParameterAndReturnSqlToken(val) {
        return this.param(val);
    }
    param(val) {
        if (val instanceof Date)
            val = val.valueOf();
        if (typeof val === 'boolean')
            val = val ? 1 : 0;
        const key = ':' + this.i++;
        this.values[key.substring(1)] = val;
        return key;
    }
}
class Sqlite3SqlResult {
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

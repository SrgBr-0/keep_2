import { SqliteCoreDataProvider } from './remult-sqlite-core.js';
export class BetterSqlite3DataProvider extends SqliteCoreDataProvider {
    constructor(db) {
        super(() => new BetterSqlite3Command(db), async () => { db.close(); });
    }
}
class BetterSqlite3Command {
    db;
    values = {};
    i = 0;
    constructor(db) {
        this.db = db;
    }
    async execute(sql) {
        const s = this.db.prepare(sql);
        if (s.reader) {
            return new BetterSqlite3SqlResult(s.all(this.values));
        }
        else {
            const result = s.run(this.values);
            return new BetterSqlite3SqlResult([]);
        }
    }
    addParameterAndReturnSqlToken(val) {
        return this.param(val);
    }
    param(val) {
        if (val instanceof Date)
            val = val.valueOf();
        if (typeof val === "boolean")
            val = val ? 1 : 0;
        const key = ':' + (this.i++);
        this.values[key.substring(1)] = (val);
        return key;
    }
}
export class BetterSqlite3SqlResult {
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

import { SqliteCoreDataProvider } from "./remult-sqlite-core.js";
export class BunSqliteDataProvider extends SqliteCoreDataProvider {
    constructor(db) {
        super(() => new BunSqliteCommand(db), async () => { db.close(); });
    }
}
class BunSqliteCommand {
    db;
    values = {};
    i = 0;
    constructor(db) {
        this.db = db;
    }
    async execute(sql) {
        const s = this.db.query(sql);
        return new BunSqliteSqlResult(s.all(this.values));
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
        this.values[key] = (val);
        return key;
    }
}
class BunSqliteSqlResult {
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

import { SqliteCoreDataProvider } from './remult-sqlite-core.js';
export class SqlJsDataProvider extends SqliteCoreDataProvider {
    constructor(db) {
        super(() => new SqlJsCommand(db), async () => (await db).close());
    }
}
class SqlJsCommand {
    db;
    values = {};
    i = 0;
    constructor(db) {
        this.db = db;
    }
    async execute(sql) {
        if (this.i == 0)
            return new SqlJsSqlResult((await this.db).exec(sql));
        return new SqlJsSqlResult((await this.db).exec(sql, this.values));
    }
    addParameterAndReturnSqlToken(val) {
        return this.param(val);
    }
    param(val) {
        if (val instanceof Date)
            val = val.valueOf();
        const key = ':' + ++this.i;
        this.values[key] = val;
        return key;
    }
}
class SqlJsSqlResult {
    result;
    constructor(result) {
        this.result = result;
        this.rows =
            result[0]?.values.map((row) => row.reduce((prev, curr, i) => ({ ...prev, [result[0].columns[i]]: curr }), {})) ?? [];
    }
    rows;
    getColumnKeyInResultForIndexInSelect(index) {
        return this.result[0]?.columns[index];
    }
}

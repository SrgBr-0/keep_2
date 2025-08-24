import { SqliteCoreDataProvider } from './remult-sqlite-core.js';
import { cast } from './src/isOfType.js';
export class TursoDataProvider extends SqliteCoreDataProvider {
    client;
    constructor(client) {
        super(() => new TursoCommand(client), async () => {
            await cast(this.client, 'close').close();
        }, false);
        this.client = client;
    }
    async transaction(action) {
        const trans = await cast(this.client, 'transaction').transaction();
        try {
            await action(new TursoDataProvider(trans));
            await trans.commit();
        }
        catch (err) {
            await trans.rollback();
            throw err;
        }
    }
}
class TursoCommand {
    db;
    values = {};
    i = 1;
    constructor(db) {
        this.db = db;
    }
    async execute(sql) {
        return new TursoSqlResult(await this.db.execute({
            sql,
            args: this.values,
        }));
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
class TursoSqlResult {
    result;
    constructor(result) {
        this.result = result;
        this.rows = result.rows;
    }
    rows;
    getColumnKeyInResultForIndexInSelect(index) {
        return this.result.columns[index];
    }
}

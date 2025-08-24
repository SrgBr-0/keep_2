import { ArrayEntityDataProvider } from './array-entity-data-provider.js';
export class InMemoryDataProvider {
    async transaction(action) {
        let before = JSON.stringify(this.rows);
        try {
            await action(this);
        }
        catch (e) {
            this.rows = JSON.parse(before);
            throw e;
        }
    }
    rows = {};
    getEntityDataProvider(entity) {
        let name = entity.dbName;
        if (!this.rows[name])
            this.rows[name] = [];
        return new ArrayEntityDataProvider(entity, () => this.rows[name]);
    }
    toString() {
        return 'InMemoryDataProvider';
    }
}

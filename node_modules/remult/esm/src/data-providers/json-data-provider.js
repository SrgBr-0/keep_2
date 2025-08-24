import { ArrayEntityDataProvider } from './array-entity-data-provider.js';
export class JsonDataProvider {
    storage;
    formatted;
    constructor(storage, formatted = false) {
        this.storage = storage;
        this.formatted = formatted;
    }
    getEntityDataProvider(entity) {
        return new JsonEntityDataProvider(entity, this.storage, this.formatted);
    }
    async transaction(action) {
        await action(this);
    }
}
class JsonEntityDataProvider {
    entity;
    helper;
    formatted;
    constructor(entity, helper, formatted) {
        this.entity = entity;
        this.helper = helper;
        this.formatted = formatted;
    }
    groupBy(options) {
        return (this.p = this.p.then(() => this.loadEntityData((dp, save) => dp.groupBy(options))));
    }
    async loadEntityData(what) {
        let data = [];
        let dbName = await this.entity.dbName;
        let s = await this.helper.getItem(dbName);
        if (s)
            data = this.helper.supportsRawJson ? s : JSON.parse(s);
        let dp = new ArrayEntityDataProvider(this.entity, () => data);
        return what(dp, async () => await this.helper.setItem(dbName, this.helper.supportsRawJson
            ? data
            : JSON.stringify(data, undefined, this.formatted ? 2 : undefined)));
    }
    p = Promise.resolve();
    find(options) {
        return (this.p = this.p.then(() => this.loadEntityData((dp, save) => dp.find(options))));
    }
    count(where) {
        return (this.p = this.p.then(() => this.loadEntityData((dp, save) => dp.count(where))));
    }
    update(id, data) {
        return (this.p = this.p.then(() => this.loadEntityData((dp, save) => dp.update(id, data).then(async (x) => {
            await save();
            return x;
        }))));
    }
    delete(id) {
        return (this.p = this.p.then(() => this.loadEntityData((dp, save) => dp.delete(id).then(async (x) => {
            await save();
            return x;
        }))));
    }
    async insert(data) {
        return (this.p = this.p.then(() => this.loadEntityData((dp, save) => dp.insert(data).then(async (x) => {
            await save();
            return x;
        }))));
    }
}

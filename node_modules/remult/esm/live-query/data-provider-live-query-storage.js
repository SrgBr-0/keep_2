import { __decorate, __metadata } from "tslib";
import { Remult } from '../src/context.js';
import { EntityBase } from '../src/remult3/RepositoryImplementation.js';
import { Fields } from '../src/remult3/Fields.js';
import { Entity } from '../src/remult3/entity.js';
import { initDataProviderOrJson } from '../server/initDataProviderOrJson.js';
export class DataProviderLiveQueryStorage {
    repo;
    dataProvider;
    constructor(dataProvider) {
        this.dataProvider = initDataProviderOrJson(dataProvider);
        this.repo = this.dataProvider.then((dp) => new Remult(dp).repo(LiveQueryStorageEntity));
    }
    async ensureSchema() {
        const dp = await this.dataProvider;
        if (dp.ensureSchema)
            await dp.ensureSchema([(await this.repo).metadata]);
    }
    async add({ id, entityKey, data }) {
        await this.repo.then(async (repo) => {
            const q = await repo.findId(id, { createIfNotFound: true });
            await q.assign({ entityKey, data }).save();
        });
    }
    async remove(queryId) {
        await this.repo
            .then(async (repo) => {
            const r = await repo.findId(queryId);
            if (r)
                await repo.delete(r);
        })
            .catch(() => { });
    }
    async forEach(entityKey, callback) {
        const repo = await this.repo;
        let d = new Date();
        d.setMinutes(d.getMinutes() - 5);
        const iso = d.toISOString();
        for (const query of await repo.find({ where: { entityKey } })) {
            if (query.lastUsedIso < iso)
                await repo.delete(query);
            else {
                await callback({
                    query,
                    setData: async (data) => {
                        query.data = data;
                        await repo.save(query);
                    },
                });
            }
        }
    }
    async keepAliveAndReturnUnknownQueryIds(queryIds) {
        const repo = await this.repo;
        for (const query of await repo.find({ where: { id: queryIds } })) {
            query.lastUsedIso = new Date().toISOString();
            await repo.save(query);
            queryIds = queryIds.filter((x) => x !== query.id);
        }
        return queryIds;
    }
}
let LiveQueryStorageEntity = class LiveQueryStorageEntity extends EntityBase {
    id = '';
    entityKey = '';
    data;
    lastUsedIso = new Date().toISOString();
};
__decorate([
    Fields.string(),
    __metadata("design:type", Object)
], LiveQueryStorageEntity.prototype, "id", void 0);
__decorate([
    Fields.string(),
    __metadata("design:type", Object)
], LiveQueryStorageEntity.prototype, "entityKey", void 0);
__decorate([
    Fields.object(),
    __metadata("design:type", Object)
], LiveQueryStorageEntity.prototype, "data", void 0);
__decorate([
    Fields.string(),
    __metadata("design:type", Object)
], LiveQueryStorageEntity.prototype, "lastUsedIso", void 0);
LiveQueryStorageEntity = __decorate([
    Entity(undefined, {
        dbName: 'remult_live_query_storage',
    })
    /*@internal */
], LiveQueryStorageEntity);
export { LiveQueryStorageEntity };

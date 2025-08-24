import { findOptionsFromJson } from '../data-providers/rest-data-provider.js';
/* @internal*/
export class LiveQueryPublisher {
    subscriptionServer;
    liveQueryStorage;
    performWithContext;
    constructor(subscriptionServer, liveQueryStorage, performWithContext) {
        this.subscriptionServer = subscriptionServer;
        this.liveQueryStorage = liveQueryStorage;
        this.performWithContext = performWithContext;
    }
    runPromise(p) { }
    debugFileSaver = (x) => { };
    async itemChanged(entityKey, changes) {
        await this.runPromise(this.liveQueryStorage().forEach(entityKey, async ({ query: q, setData }) => {
            let query = { ...q.data };
            await this.performWithContext(query.requestJson, entityKey, async (repo) => {
                const messages = [];
                const currentItems = await repo.find(findOptionsFromJson(query.findOptionsJson, repo.metadata));
                const currentIds = currentItems.map((x) => repo.getEntityRef(x).getId());
                for (const id of query.lastIds.filter((y) => !currentIds.includes(y))) {
                    let c = changes.find((c) => c.oldId == id);
                    if (c === undefined ||
                        id != c.oldId ||
                        !currentIds.includes(c.id))
                        messages.push({
                            type: 'remove',
                            data: {
                                id: id,
                            },
                        });
                }
                for (const item of currentItems) {
                    const itemRef = repo.getEntityRef(item);
                    let c = changes.find((c) => c.id == itemRef.getId());
                    if (c !== undefined && query.lastIds.includes(c.oldId)) {
                        messages.push({
                            type: 'replace',
                            data: {
                                oldId: c.oldId,
                                item: itemRef.toApiJson(),
                            },
                        });
                    }
                    else if (!query.lastIds.includes(itemRef.getId())) {
                        messages.push({
                            type: 'add',
                            data: { item: itemRef.toApiJson() },
                        });
                    }
                }
                this.debugFileSaver({
                    query: q.id,
                    currentIds,
                    changes,
                    lastIds: query.lastIds,
                    messages,
                });
                query.lastIds = currentIds;
                await setData(query);
                if (messages.length > 0)
                    this.subscriptionServer().publishMessage(q.id, messages);
            });
        }));
    }
}
export class InMemoryLiveQueryStorage {
    debugFileSaver = (x) => { };
    debug() {
        this.debugFileSaver(this.queries);
    }
    async keepAliveAndReturnUnknownQueryIds(ids) {
        const result = [];
        for (const id of ids) {
            let q = this.queries.find((q) => q.id === id);
            if (q) {
                q.lastUsed = new Date().toISOString();
            }
            else
                result.push(id);
        }
        this.debug();
        return result;
    }
    queries = [];
    constructor() { }
    async add(query) {
        this.queries.push({ ...query, lastUsed: new Date().toISOString() });
        this.debug();
    }
    removeCountForTesting = 0;
    async remove(id) {
        this.queries = this.queries.filter((q) => q.id !== id);
        this.removeCountForTesting++;
        this.debug();
    }
    async forEach(entityKey, handle) {
        let d = new Date();
        d.setMinutes(d.getMinutes() - 5);
        this.queries = this.queries.filter((x) => x.lastUsed > d.toISOString());
        for (const q of this.queries) {
            if (q.entityKey === entityKey) {
                await handle({
                    query: q,
                    setData: async (data) => {
                        q.data = data;
                    },
                });
            }
        }
        this.debug();
    }
}

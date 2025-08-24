import { InMemoryDataProvider, remult, RestDataProvider, } from '../index.js';
import { createRemultServerCore, } from './remult-api-server.js';
import { remultStatic } from '../src/remult-static.js';
import { RemultAsyncLocalStorage } from '../src/context.js';
import { initDataProvider } from './initDataProvider.js';
export function TestApiDataProvider(options) {
    if (!options)
        options = {};
    var dp = initDataProvider(options.dataProvider, false, async () => {
        return new InMemoryDataProvider();
    });
    const server = createRemultServerCore({ ...options, dataProvider: dp }, {
        getRequestBody: async (req) => req.body,
        buildGenericRequestInfo: (req) => req,
        ignoreAsyncStorage: true,
    });
    async function handleOnServer(req) {
        return await MakeServerCallWithDifferentStaticRemult(async () => {
            if (newEntities.length > 0 && options?.ensureSchema != false) {
                await (await dp).ensureSchema?.(newEntities);
                newEntities = [];
            }
            var result = await server.handle(req);
            if ((result?.statusCode ?? 200) >= 400) {
                throw { ...result?.data, status: result?.statusCode ?? 500 };
            }
            return result?.data;
        });
    }
    const registeredEntities = new Set();
    let newEntities = [];
    return new RestDataProvider(() => ({
        httpClient: {
            get: (url) => handleOnServer({
                url: url,
                method: 'GET',
            }),
            put: (url, body) => handleOnServer({
                method: 'PUT',
                url: url,
                body: body,
            }),
            post: (url, body) => handleOnServer({
                method: 'POST',
                url: url,
                body,
            }),
            delete: (url) => handleOnServer({
                method: 'DELETE',
                url: url,
            }),
        },
    }), (entity) => {
        if (!registeredEntities.has(entity.key)) {
            registeredEntities.add(entity.key);
            server.__addEntityForTesting(entity);
            newEntities.push(entity);
        }
    });
}
async function MakeServerCallWithDifferentStaticRemult(what) {
    var x = remultStatic.asyncContext;
    var y = remultStatic.remultFactory;
    const user = { ...remult.user };
    let store;
    remultStatic.remultFactory = () => store.remult;
    try {
        remultStatic.asyncContext = new RemultAsyncLocalStorage({
            getStore: () => store,
            run: (pStore, callback) => {
                store = pStore;
                store.remult.user = user;
                return callback();
            },
            wasImplemented: 'yes',
        });
        return await what();
    }
    finally {
        remultStatic.asyncContext = x;
        remultStatic.remultFactory = y;
    }
}

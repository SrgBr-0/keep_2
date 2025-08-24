import { createRemultServerCore, } from './remult-api-server.js';
import { initAsyncHooks } from './initAsyncHooks.js';
import { cast } from '../src/isOfType.js';
export { SseSubscriptionServer } from '../SseSubscriptionServer.js';
export { DataProviderLiveQueryStorage } from '../live-query/data-provider-live-query-storage.js';
export { JsonEntityFileStorage, JsonFileDataProvider, } from './JsonEntityFileStorage.js';
export { TestApiDataProvider } from './test-api-data-provider.js';
export function createRemultServer(options, serverCoreOptions) {
    initAsyncHooks();
    return createRemultServerCore(options, serverCoreOptions || {
        buildGenericRequestInfo: (req) => cast(req, 'method'),
        getRequestBody: async (req) => req.body,
    });
}

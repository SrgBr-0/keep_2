import { AsyncLocalStorage } from 'async_hooks';
import { RemultAsyncLocalStorage, } from '../src/context.js';
import { remultStatic } from '../src/remult-static.js';
let init = false;
export function initAsyncHooks() {
    if (init)
        return;
    init = true;
    remultStatic.asyncContext = new RemultAsyncLocalStorage(new AsyncLocalStorageBridgeToRemultAsyncLocalStorageCore());
    let test = new AsyncLocalStorage();
    test.run(1, async () => {
        await Promise.resolve();
        if (test.getStore() === undefined) {
            console.log("async_hooks.AsyncLocalStorage not working, using stub implementation (You're probably running on stackblitz, this will work on a normal nodejs environment)");
            remultStatic.asyncContext = new RemultAsyncLocalStorage(new StubRemultAsyncLocalStorageCore());
        }
    });
}
export class AsyncLocalStorageBridgeToRemultAsyncLocalStorageCoreImpl {
    asyncLocalStorage = new AsyncLocalStorage();
    wasImplemented = 'yes';
    run(store, callback) {
        let r;
        this.asyncLocalStorage.run(store, () => {
            r = new Promise(async (res, rej) => {
                try {
                    res(await callback());
                }
                catch (err) {
                    rej(err);
                }
            });
        });
        return r;
    }
    getStore() {
        return this.asyncLocalStorage.getStore();
    }
}
export class StubRemultAsyncLocalStorageCore {
    isStub = true;
    wasImplemented = 'yes';
    async run(store, callback) {
        this.currentValue = store;
        return await callback();
    }
    getStore() {
        return this.currentValue;
    }
    lastPromise = Promise.resolve(undefined);
    currentValue;
}
export class AsyncLocalStorageBridgeToRemultAsyncLocalStorageCore extends AsyncLocalStorageBridgeToRemultAsyncLocalStorageCoreImpl {
}

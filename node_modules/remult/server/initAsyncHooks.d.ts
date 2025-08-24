import { type RemultAsyncLocalStorageCore } from '../src/context.js';
export declare function initAsyncHooks(): void;
export declare class AsyncLocalStorageBridgeToRemultAsyncLocalStorageCoreImpl<T> implements RemultAsyncLocalStorageCore<T> {
    private asyncLocalStorage;
    wasImplemented: "yes";
    run<R>(store: T, callback: () => Promise<R>): Promise<R>;
    getStore(): T | undefined;
}
export declare class StubRemultAsyncLocalStorageCore<T> implements RemultAsyncLocalStorageCore<T> {
    isStub: boolean;
    wasImplemented: "yes";
    run<R>(store: T, callback: () => Promise<R>): Promise<R>;
    getStore(): T | undefined;
    lastPromise: Promise<T | undefined>;
    currentValue?: T;
}
export declare class AsyncLocalStorageBridgeToRemultAsyncLocalStorageCore<T> extends AsyncLocalStorageBridgeToRemultAsyncLocalStorageCoreImpl<T> {
}

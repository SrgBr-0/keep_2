import type { DataProvider } from '../src/data-interfaces.js';
export declare function initDataProviderOrJson(dataProvider: DataProvider | Promise<DataProvider> | (() => Promise<DataProvider | undefined>) | undefined): Promise<DataProvider>;

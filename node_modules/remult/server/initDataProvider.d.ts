import type { DataProvider } from '../src/data-interfaces.js';
export declare function initDataProvider(optionsDataProvider: DataProvider | Promise<DataProvider> | (() => Promise<DataProvider | undefined>) | undefined, useStaticDefault: boolean, defaultDataProvider: () => Promise<DataProvider>): Promise<DataProvider>;

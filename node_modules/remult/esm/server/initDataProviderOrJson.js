import { initDataProvider } from './initDataProvider.js';
export function initDataProviderOrJson(dataProvider) {
    return initDataProvider(dataProvider, false, async () => {
        return new (await import('./JsonEntityFileStorage.js')).JsonFileDataProvider('./db');
    });
}

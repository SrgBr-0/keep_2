import { remultStatic } from '../src/remult-static.js';
export function initDataProvider(optionsDataProvider, useStaticDefault, defaultDataProvider) {
    let dataProvider;
    if (typeof optionsDataProvider === 'function') {
        dataProvider = optionsDataProvider();
    }
    else
        dataProvider = Promise.resolve(optionsDataProvider);
    dataProvider = dataProvider.then(async (dp) => {
        if (dp)
            return dp;
        if (useStaticDefault)
            dp = await remultStatic.defaultDataProvider();
        if (dp)
            return dp;
        return defaultDataProvider?.();
    });
    return dataProvider;
}

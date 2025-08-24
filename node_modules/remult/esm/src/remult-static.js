const remultStaticKey = Symbol.for('remult-static1');
let x = {
    defaultRemultFactory: undefined,
    remultFactory: undefined,
    defaultRemult: undefined,
    asyncContext: undefined,
    columnsOfType: new Map(),
    allEntities: [],
    classHelpers: new Map(),
    actionInfo: {
        allActions: [],
        runningOnServer: false,
        runActionWithoutBlockingUI: (what) => {
            return what();
        },
        startBusyWithProgress: () => ({
            progress: (percent) => { },
            close: () => { },
        }),
    },
    fieldOptionsEnricher: undefined,
    captionTransformer: undefined,
    defaultDataProvider: () => undefined,
};
if ((typeof process !== 'undefined' &&
    process.env['IGNORE_GLOBAL_REMULT_IN_TESTS']) ||
    typeof globalThis[remultStaticKey] === 'undefined') {
    ;
    globalThis[remultStaticKey] = x;
    x.remultFactory = () => defaultFactory();
}
else {
    x = globalThis[remultStaticKey];
}
export const remultStatic = x;
export function defaultFactory() {
    if (!remultStatic.defaultRemult) {
        remultStatic.defaultRemult = remultStatic.defaultRemultFactory();
    }
    return remultStatic.defaultRemult;
}
export function resetFactory() {
    remultStatic.remultFactory = () => defaultFactory();
}

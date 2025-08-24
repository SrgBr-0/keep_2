"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.remultStatic = void 0;
exports.defaultFactory = defaultFactory;
exports.resetFactory = resetFactory;
var remultStaticKey = Symbol.for('remult-static1');
var x = {
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
        runActionWithoutBlockingUI: function (what) {
            return what();
        },
        startBusyWithProgress: function () { return ({
            progress: function (percent) { },
            close: function () { },
        }); },
    },
    fieldOptionsEnricher: undefined,
    captionTransformer: undefined,
    defaultDataProvider: function () {
        return undefined;
    },
};
if ((typeof process !== 'undefined' &&
    process.env['IGNORE_GLOBAL_REMULT_IN_TESTS']) ||
    typeof globalThis[remultStaticKey] === 'undefined') {
    ;
    globalThis[remultStaticKey] = x;
    x.remultFactory = function () { return defaultFactory(); };
}
else {
    x = globalThis[remultStaticKey];
}
exports.remultStatic = x;
function defaultFactory() {
    if (!exports.remultStatic.defaultRemult) {
        exports.remultStatic.defaultRemult = exports.remultStatic.defaultRemultFactory();
    }
    return exports.remultStatic.defaultRemult;
}
function resetFactory() {
    exports.remultStatic.remultFactory = function () { return defaultFactory(); };
}

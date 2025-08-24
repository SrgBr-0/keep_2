"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initDataProvider = initDataProvider;
var tslib_1 = require("tslib");
var remult_static_js_1 = require("../src/remult-static.js");
function initDataProvider(optionsDataProvider, useStaticDefault, defaultDataProvider) {
    var _this = this;
    var dataProvider;
    if (typeof optionsDataProvider === 'function') {
        dataProvider = optionsDataProvider();
    }
    else
        dataProvider = Promise.resolve(optionsDataProvider);
    dataProvider = dataProvider.then(function (dp) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (dp)
                        return [2 /*return*/, dp];
                    if (!useStaticDefault) return [3 /*break*/, 2];
                    return [4 /*yield*/, remult_static_js_1.remultStatic.defaultDataProvider()];
                case 1:
                    dp = _a.sent();
                    _a.label = 2;
                case 2:
                    if (dp)
                        return [2 /*return*/, dp];
                    return [2 /*return*/, defaultDataProvider === null || defaultDataProvider === void 0 ? void 0 : defaultDataProvider()];
            }
        });
    }); });
    return dataProvider;
}

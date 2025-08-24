"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initDataProviderOrJson = initDataProviderOrJson;
var tslib_1 = require("tslib");
var initDataProvider_js_1 = require("./initDataProvider.js");
function initDataProviderOrJson(dataProvider) {
    var _this = this;
    return (0, initDataProvider_js_1.initDataProvider)(dataProvider, false, function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return tslib_1.__importStar(require('./JsonEntityFileStorage.js')); })];
                case 1: return [2 /*return*/, new (_a.sent()).JsonFileDataProvider('./db')];
            }
        });
    }); });
}

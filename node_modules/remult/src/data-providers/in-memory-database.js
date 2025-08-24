"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryDataProvider = void 0;
var tslib_1 = require("tslib");
var array_entity_data_provider_js_1 = require("./array-entity-data-provider.js");
var InMemoryDataProvider = /** @class */ (function () {
    function InMemoryDataProvider() {
        this.rows = {};
    }
    InMemoryDataProvider.prototype.transaction = function (action) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var before, e_1;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        before = JSON.stringify(this.rows);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, action(this)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        this.rows = JSON.parse(before);
                        throw e_1;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    InMemoryDataProvider.prototype.getEntityDataProvider = function (entity) {
        var _this = this;
        var name = entity.dbName;
        if (!this.rows[name])
            this.rows[name] = [];
        return new array_entity_data_provider_js_1.ArrayEntityDataProvider(entity, function () { return _this.rows[name]; });
    };
    InMemoryDataProvider.prototype.toString = function () {
        return 'InMemoryDataProvider';
    };
    return InMemoryDataProvider;
}());
exports.InMemoryDataProvider = InMemoryDataProvider;

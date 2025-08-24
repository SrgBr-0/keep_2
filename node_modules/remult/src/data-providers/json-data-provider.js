"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonDataProvider = void 0;
var tslib_1 = require("tslib");
var array_entity_data_provider_js_1 = require("./array-entity-data-provider.js");
var JsonDataProvider = /** @class */ (function () {
    function JsonDataProvider(storage, formatted) {
        if (formatted === void 0) { formatted = false; }
        this.storage = storage;
        this.formatted = formatted;
    }
    JsonDataProvider.prototype.getEntityDataProvider = function (entity) {
        return new JsonEntityDataProvider(entity, this.storage, this.formatted);
    };
    JsonDataProvider.prototype.transaction = function (action) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, action(this)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return JsonDataProvider;
}());
exports.JsonDataProvider = JsonDataProvider;
var JsonEntityDataProvider = /** @class */ (function () {
    function JsonEntityDataProvider(entity, helper, formatted) {
        this.entity = entity;
        this.helper = helper;
        this.formatted = formatted;
        this.p = Promise.resolve();
    }
    JsonEntityDataProvider.prototype.groupBy = function (options) {
        var _this = this;
        return (this.p = this.p.then(function () {
            return _this.loadEntityData(function (dp, save) { return dp.groupBy(options); });
        }));
    };
    JsonEntityDataProvider.prototype.loadEntityData = function (what) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var data, dbName, s, dp;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        data = [];
                        return [4 /*yield*/, this.entity.dbName];
                    case 1:
                        dbName = _a.sent();
                        return [4 /*yield*/, this.helper.getItem(dbName)];
                    case 2:
                        s = _a.sent();
                        if (s)
                            data = this.helper.supportsRawJson ? s : JSON.parse(s);
                        dp = new array_entity_data_provider_js_1.ArrayEntityDataProvider(this.entity, function () { return data; });
                        return [2 /*return*/, what(dp, function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                return tslib_1.__generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this.helper.setItem(dbName, this.helper.supportsRawJson
                                                ? data
                                                : JSON.stringify(data, undefined, this.formatted ? 2 : undefined))];
                                        case 1: return [2 /*return*/, _a.sent()];
                                    }
                                });
                            }); })];
                }
            });
        });
    };
    JsonEntityDataProvider.prototype.find = function (options) {
        var _this = this;
        return (this.p = this.p.then(function () {
            return _this.loadEntityData(function (dp, save) { return dp.find(options); });
        }));
    };
    JsonEntityDataProvider.prototype.count = function (where) {
        var _this = this;
        return (this.p = this.p.then(function () {
            return _this.loadEntityData(function (dp, save) { return dp.count(where); });
        }));
    };
    JsonEntityDataProvider.prototype.update = function (id, data) {
        var _this = this;
        return (this.p = this.p.then(function () {
            return _this.loadEntityData(function (dp, save) {
                return dp.update(id, data).then(function (x) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                    return tslib_1.__generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, save()];
                            case 1:
                                _a.sent();
                                return [2 /*return*/, x];
                        }
                    });
                }); });
            });
        }));
    };
    JsonEntityDataProvider.prototype.delete = function (id) {
        var _this = this;
        return (this.p = this.p.then(function () {
            return _this.loadEntityData(function (dp, save) {
                return dp.delete(id).then(function (x) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                    return tslib_1.__generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, save()];
                            case 1:
                                _a.sent();
                                return [2 /*return*/, x];
                        }
                    });
                }); });
            });
        }));
    };
    JsonEntityDataProvider.prototype.insert = function (data) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, (this.p = this.p.then(function () {
                        return _this.loadEntityData(function (dp, save) {
                            return dp.insert(data).then(function (x) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                return tslib_1.__generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, save()];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/, x];
                                    }
                                });
                            }); });
                        });
                    }))];
            });
        });
    };
    return JsonEntityDataProvider;
}());

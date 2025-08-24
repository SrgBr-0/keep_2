"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonEntityIndexedDbStorage = void 0;
var tslib_1 = require("tslib");
var JsonEntityIndexedDbStorage = /** @class */ (function () {
    function JsonEntityIndexedDbStorage(dbName, storeName) {
        if (dbName === void 0) { dbName = 'db'; }
        if (storeName === void 0) { storeName = 'jsonStore'; }
        this.dbName = dbName;
        this.storeName = storeName;
        this.supportsRawJson = true;
    }
    JsonEntityIndexedDbStorage.prototype.getItem = function (entityDbName) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                        var transaction, store, request;
                        return tslib_1.__generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, this.init()];
                                case 1:
                                    transaction = (_a.sent()).transaction([this.storeName], 'readonly');
                                    store = transaction.objectStore(this.storeName);
                                    request = store.get(entityDbName);
                                    request.onerror = function (event) { return reject(request.error); };
                                    request.onsuccess = function (event) {
                                        if (request.result) {
                                            resolve(request.result);
                                        }
                                        else {
                                            resolve(null);
                                        }
                                    };
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    //@internal
    JsonEntityIndexedDbStorage.prototype.init = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a;
            var _this = this;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!!this.db) return [3 /*break*/, 2];
                        _a = this;
                        return [4 /*yield*/, new Promise(function (resolve, reject) {
                                var db;
                                var request = indexedDB.open(_this.dbName, 1);
                                request.onerror = function (event) { return reject(request.error); };
                                request.onsuccess = function (event) {
                                    db = request.result;
                                    resolve(db);
                                };
                                request.onupgradeneeded = function (event) {
                                    db = request.result;
                                    db.createObjectStore(_this.storeName);
                                };
                            })];
                    case 1:
                        _a.db = _b.sent();
                        _b.label = 2;
                    case 2: return [2 /*return*/, this.db];
                }
            });
        });
    };
    JsonEntityIndexedDbStorage.prototype.setItem = function (entityDbName, json) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                        var transaction, store, request;
                        return tslib_1.__generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, this.init()];
                                case 1:
                                    transaction = (_a.sent()).transaction([this.storeName], 'readwrite');
                                    store = transaction.objectStore(this.storeName);
                                    request = store.put(json, entityDbName);
                                    request.onerror = function (event) { return reject(request.error); };
                                    request.onsuccess = function (event) { return resolve(); };
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    return JsonEntityIndexedDbStorage;
}());
exports.JsonEntityIndexedDbStorage = JsonEntityIndexedDbStorage;

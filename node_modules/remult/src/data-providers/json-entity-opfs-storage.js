"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonEntityOpfsStorage = void 0;
var tslib_1 = require("tslib");
var JsonEntityOpfsStorage = /** @class */ (function () {
    function JsonEntityOpfsStorage() {
    }
    JsonEntityOpfsStorage.prototype.getItem = function (entityDbName) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var opfsFile, readable;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.init()];
                    case 1: return [4 /*yield*/, (_a.sent()).getFileHandle(entityDbName + '.json', {
                            create: true,
                        })];
                    case 2:
                        opfsFile = _a.sent();
                        return [4 /*yield*/, opfsFile.getFile()];
                    case 3:
                        readable = _a.sent();
                        return [4 /*yield*/, readable.text()];
                    case 4: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    //@internal
    JsonEntityOpfsStorage.prototype.init = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!!this.opfsRoot) return [3 /*break*/, 2];
                        _a = this;
                        return [4 /*yield*/, navigator.storage.getDirectory()];
                    case 1:
                        _a.opfsRoot = _b.sent();
                        _b.label = 2;
                    case 2: return [2 /*return*/, this.opfsRoot];
                }
            });
        });
    };
    JsonEntityOpfsStorage.prototype.setItem = function (entityDbName, json) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var opfsFile, writable;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.init()];
                    case 1: return [4 /*yield*/, (_a.sent()).getFileHandle(entityDbName + '.json', {
                            create: true,
                        })];
                    case 2: return [4 /*yield*/, _a.sent()];
                    case 3:
                        opfsFile = _a.sent();
                        return [4 /*yield*/, opfsFile.createWritable()];
                    case 4:
                        writable = _a.sent();
                        return [4 /*yield*/, writable.write(json)];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, writable.close()];
                    case 6:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return JsonEntityOpfsStorage;
}());
exports.JsonEntityOpfsStorage = JsonEntityOpfsStorage;

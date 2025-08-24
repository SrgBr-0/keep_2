"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultMigrationBuilder = void 0;
var tslib_1 = require("tslib");
var DefaultMigrationBuilder = /** @class */ (function () {
    function DefaultMigrationBuilder(code, wrapped) {
        this.code = code;
        this.wrapped = wrapped;
    }
    DefaultMigrationBuilder.prototype.createTable = function (meta) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!((_a = this.wrapped) === null || _a === void 0 ? void 0 : _a.createTable)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.wrapped.createTable(meta)];
                    case 1:
                        _b.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        this.code.addComment('TODO: implement create table ' + meta.dbName);
                        _b.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    DefaultMigrationBuilder.prototype.addColumn = function (meta, field) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!((_a = this.wrapped) === null || _a === void 0 ? void 0 : _a.addColumn)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.wrapped.addColumn(meta, field)];
                    case 1:
                        _b.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        this.code.addComment('TODO: implement add column ' + meta.dbName + '.' + field.dbName);
                        _b.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    DefaultMigrationBuilder.prototype.removeTable = function (entityDbName) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!((_a = this.wrapped) === null || _a === void 0 ? void 0 : _a.removeTable)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.wrapped.removeTable(entityDbName)];
                    case 1:
                        _b.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        this.code.addComment('TODO: implement remove table ' + entityDbName);
                        _b.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    DefaultMigrationBuilder.prototype.removeColumn = function (entityName, columnDbName) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!((_a = this.wrapped) === null || _a === void 0 ? void 0 : _a.removeColumn)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.wrapped.removeColumn(entityName, columnDbName)];
                    case 1:
                        _b.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        this.code.addComment('TODO: implement remove column ' + entityName + '.' + columnDbName);
                        _b.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return DefaultMigrationBuilder;
}());
exports.DefaultMigrationBuilder = DefaultMigrationBuilder;

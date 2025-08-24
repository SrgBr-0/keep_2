"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TursoDataProvider = void 0;
var tslib_1 = require("tslib");
var remult_sqlite_core_js_1 = require("./remult-sqlite-core.js");
var isOfType_js_1 = require("./src/isOfType.js");
var TursoDataProvider = /** @class */ (function (_super) {
    tslib_1.__extends(TursoDataProvider, _super);
    function TursoDataProvider(client) {
        var _this = _super.call(this, function () { return new TursoCommand(client); }, function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, isOfType_js_1.cast)(this.client, 'close').close()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); }, false) || this;
        _this.client = client;
        return _this;
    }
    TursoDataProvider.prototype.transaction = function (action) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var trans, err_1;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, isOfType_js_1.cast)(this.client, 'transaction').transaction()];
                    case 1:
                        trans = _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 5, , 7]);
                        return [4 /*yield*/, action(new TursoDataProvider(trans))];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, trans.commit()];
                    case 4:
                        _a.sent();
                        return [3 /*break*/, 7];
                    case 5:
                        err_1 = _a.sent();
                        return [4 /*yield*/, trans.rollback()];
                    case 6:
                        _a.sent();
                        throw err_1;
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    return TursoDataProvider;
}(remult_sqlite_core_js_1.SqliteCoreDataProvider));
exports.TursoDataProvider = TursoDataProvider;
var TursoCommand = /** @class */ (function () {
    function TursoCommand(db) {
        this.db = db;
        this.values = {};
        this.i = 1;
    }
    TursoCommand.prototype.execute = function (sql) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = TursoSqlResult.bind;
                        return [4 /*yield*/, this.db.execute({
                                sql: sql,
                                args: this.values,
                            })];
                    case 1: return [2 /*return*/, new (_a.apply(TursoSqlResult, [void 0, _b.sent()]))()];
                }
            });
        });
    };
    TursoCommand.prototype.addParameterAndReturnSqlToken = function (val) {
        return this.param(val);
    };
    TursoCommand.prototype.param = function (val) {
        if (val instanceof Date)
            val = val.valueOf();
        if (typeof val === 'boolean')
            val = val ? 1 : 0;
        var key = ':' + this.i++;
        this.values[key.substring(1)] = val;
        return key;
    };
    return TursoCommand;
}());
var TursoSqlResult = /** @class */ (function () {
    function TursoSqlResult(result) {
        this.result = result;
        this.rows = result.rows;
    }
    TursoSqlResult.prototype.getColumnKeyInResultForIndexInSelect = function (index) {
        return this.result.columns[index];
    };
    return TursoSqlResult;
}());

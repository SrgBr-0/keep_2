"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SqlJsDataProvider = void 0;
var tslib_1 = require("tslib");
var remult_sqlite_core_js_1 = require("./remult-sqlite-core.js");
var SqlJsDataProvider = /** @class */ (function (_super) {
    tslib_1.__extends(SqlJsDataProvider, _super);
    function SqlJsDataProvider(db) {
        var _this = _super.call(this, function () { return new SqlJsCommand(db); }, function () { return tslib_1.__awaiter(_this, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db];
                case 1: return [2 /*return*/, (_a.sent()).close()];
            }
        }); }); }) || this;
        return _this;
    }
    return SqlJsDataProvider;
}(remult_sqlite_core_js_1.SqliteCoreDataProvider));
exports.SqlJsDataProvider = SqlJsDataProvider;
var SqlJsCommand = /** @class */ (function () {
    function SqlJsCommand(db) {
        this.db = db;
        this.values = {};
        this.i = 0;
    }
    SqlJsCommand.prototype.execute = function (sql) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!(this.i == 0)) return [3 /*break*/, 2];
                        _a = SqlJsSqlResult.bind;
                        return [4 /*yield*/, this.db];
                    case 1: return [2 /*return*/, new (_a.apply(SqlJsSqlResult, [void 0, (_c.sent()).exec(sql)]))()];
                    case 2:
                        _b = SqlJsSqlResult.bind;
                        return [4 /*yield*/, this.db];
                    case 3: return [2 /*return*/, new (_b.apply(SqlJsSqlResult, [void 0, (_c.sent()).exec(sql, this.values)]))()];
                }
            });
        });
    };
    SqlJsCommand.prototype.addParameterAndReturnSqlToken = function (val) {
        return this.param(val);
    };
    SqlJsCommand.prototype.param = function (val) {
        if (val instanceof Date)
            val = val.valueOf();
        var key = ':' + ++this.i;
        this.values[key] = val;
        return key;
    };
    return SqlJsCommand;
}());
var SqlJsSqlResult = /** @class */ (function () {
    function SqlJsSqlResult(result) {
        var _a, _b;
        this.result = result;
        this.rows =
            (_b = (_a = result[0]) === null || _a === void 0 ? void 0 : _a.values.map(function (row) {
                return row.reduce(function (prev, curr, i) {
                    var _a;
                    return (tslib_1.__assign(tslib_1.__assign({}, prev), (_a = {}, _a[result[0].columns[i]] = curr, _a)));
                }, {});
            })) !== null && _b !== void 0 ? _b : [];
    }
    SqlJsSqlResult.prototype.getColumnKeyInResultForIndexInSelect = function (index) {
        var _a;
        return (_a = this.result[0]) === null || _a === void 0 ? void 0 : _a.columns[index];
    };
    return SqlJsSqlResult;
}());

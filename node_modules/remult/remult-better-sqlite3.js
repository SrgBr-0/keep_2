"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BetterSqlite3SqlResult = exports.BetterSqlite3DataProvider = void 0;
var tslib_1 = require("tslib");
var remult_sqlite_core_js_1 = require("./remult-sqlite-core.js");
var BetterSqlite3DataProvider = /** @class */ (function (_super) {
    tslib_1.__extends(BetterSqlite3DataProvider, _super);
    function BetterSqlite3DataProvider(db) {
        var _this = _super.call(this, function () { return new BetterSqlite3Command(db); }, function () { return tslib_1.__awaiter(_this, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
            db.close();
            return [2 /*return*/];
        }); }); }) || this;
        return _this;
    }
    return BetterSqlite3DataProvider;
}(remult_sqlite_core_js_1.SqliteCoreDataProvider));
exports.BetterSqlite3DataProvider = BetterSqlite3DataProvider;
var BetterSqlite3Command = /** @class */ (function () {
    function BetterSqlite3Command(db) {
        this.db = db;
        this.values = {};
        this.i = 0;
    }
    BetterSqlite3Command.prototype.execute = function (sql) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var s, result;
            return tslib_1.__generator(this, function (_a) {
                s = this.db.prepare(sql);
                if (s.reader) {
                    return [2 /*return*/, new BetterSqlite3SqlResult(s.all(this.values))];
                }
                else {
                    result = s.run(this.values);
                    return [2 /*return*/, new BetterSqlite3SqlResult([])];
                }
                return [2 /*return*/];
            });
        });
    };
    BetterSqlite3Command.prototype.addParameterAndReturnSqlToken = function (val) {
        return this.param(val);
    };
    BetterSqlite3Command.prototype.param = function (val) {
        if (val instanceof Date)
            val = val.valueOf();
        if (typeof val === "boolean")
            val = val ? 1 : 0;
        var key = ':' + (this.i++);
        this.values[key.substring(1)] = (val);
        return key;
    };
    return BetterSqlite3Command;
}());
var BetterSqlite3SqlResult = /** @class */ (function () {
    function BetterSqlite3SqlResult(result) {
        this.result = result;
        this.rows = result;
    }
    BetterSqlite3SqlResult.prototype.getColumnKeyInResultForIndexInSelect = function (index) {
        return Object.keys(this.result[0])[index];
    };
    return BetterSqlite3SqlResult;
}());
exports.BetterSqlite3SqlResult = BetterSqlite3SqlResult;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BunSqliteDataProvider = void 0;
var tslib_1 = require("tslib");
var remult_sqlite_core_js_1 = require("./remult-sqlite-core.js");
var BunSqliteDataProvider = /** @class */ (function (_super) {
    tslib_1.__extends(BunSqliteDataProvider, _super);
    function BunSqliteDataProvider(db) {
        var _this = _super.call(this, function () { return new BunSqliteCommand(db); }, function () { return tslib_1.__awaiter(_this, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
            db.close();
            return [2 /*return*/];
        }); }); }) || this;
        return _this;
    }
    return BunSqliteDataProvider;
}(remult_sqlite_core_js_1.SqliteCoreDataProvider));
exports.BunSqliteDataProvider = BunSqliteDataProvider;
var BunSqliteCommand = /** @class */ (function () {
    function BunSqliteCommand(db) {
        this.db = db;
        this.values = {};
        this.i = 0;
    }
    BunSqliteCommand.prototype.execute = function (sql) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var s;
            return tslib_1.__generator(this, function (_a) {
                s = this.db.query(sql);
                return [2 /*return*/, new BunSqliteSqlResult(s.all(this.values))];
            });
        });
    };
    BunSqliteCommand.prototype.addParameterAndReturnSqlToken = function (val) {
        return this.param(val);
    };
    BunSqliteCommand.prototype.param = function (val) {
        if (val instanceof Date)
            val = val.valueOf();
        if (typeof val === "boolean")
            val = val ? 1 : 0;
        var key = ':' + (this.i++);
        this.values[key] = (val);
        return key;
    };
    return BunSqliteCommand;
}());
var BunSqliteSqlResult = /** @class */ (function () {
    function BunSqliteSqlResult(result) {
        this.result = result;
        this.rows = result;
    }
    BunSqliteSqlResult.prototype.getColumnKeyInResultForIndexInSelect = function (index) {
        return Object.keys(this.result[0])[index];
    };
    return BunSqliteSqlResult;
}());

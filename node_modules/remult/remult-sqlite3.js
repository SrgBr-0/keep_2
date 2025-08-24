"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sqlite3DataProvider = void 0;
exports.createSqlite3DataProvider = createSqlite3DataProvider;
var tslib_1 = require("tslib");
var index_js_1 = require("./index.js");
var remult_sqlite_core_js_1 = require("./remult-sqlite-core.js");
function createSqlite3DataProvider() {
    return tslib_1.__awaiter(this, arguments, void 0, function (fileName) {
        var sqlite3;
        if (fileName === void 0) { fileName = ':memory:'; }
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return tslib_1.__importStar(require('sqlite3')); })];
                case 1:
                    sqlite3 = _a.sent();
                    return [2 /*return*/, new index_js_1.SqlDatabase(new Sqlite3DataProvider(new sqlite3.default.Database(fileName)))];
            }
        });
    });
}
var Sqlite3DataProvider = /** @class */ (function (_super) {
    tslib_1.__extends(Sqlite3DataProvider, _super);
    function Sqlite3DataProvider(db) {
        var _this = _super.call(this, function () { return new Sqlite3Command(db); }, function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                db.close();
                return [2 /*return*/];
            });
        }); }, true) || this;
        return _this;
    }
    return Sqlite3DataProvider;
}(remult_sqlite_core_js_1.SqliteCoreDataProvider));
exports.Sqlite3DataProvider = Sqlite3DataProvider;
var Sqlite3Command = /** @class */ (function () {
    function Sqlite3Command(db) {
        this.db = db;
        this.values = {};
        this.i = 1;
    }
    Sqlite3Command.prototype.execute = function (sql) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, error) {
                        if (sql.startsWith('insert into')) {
                            _this.db.run(sql, _this.values, function (err, rows) {
                                if (err)
                                    error(err);
                                else
                                    resolve(new Sqlite3SqlResult([
                                        //@ts-expect-error last id comes from sql lite as a lastId member of the function this
                                        this.lastID,
                                    ]));
                            });
                        }
                        else
                            _this.db.all(sql, _this.values, function (err, rows) {
                                if (err)
                                    error(err);
                                else
                                    resolve(new Sqlite3SqlResult(rows));
                            });
                    })];
            });
        });
    };
    Sqlite3Command.prototype.addParameterAndReturnSqlToken = function (val) {
        return this.param(val);
    };
    Sqlite3Command.prototype.param = function (val) {
        if (val instanceof Date)
            val = val.valueOf();
        if (typeof val === 'boolean')
            val = val ? 1 : 0;
        var key = ':' + this.i++;
        this.values[key.substring(1)] = val;
        return key;
    };
    return Sqlite3Command;
}());
var Sqlite3SqlResult = /** @class */ (function () {
    function Sqlite3SqlResult(result) {
        this.result = result;
        this.rows = result;
    }
    Sqlite3SqlResult.prototype.getColumnKeyInResultForIndexInSelect = function (index) {
        return Object.keys(this.result[0])[index];
    };
    return Sqlite3SqlResult;
}());

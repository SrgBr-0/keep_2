"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.migrate = migrate;
var tslib_1 = require("tslib");
var index_js_1 = require("../index.js");
var initDataProviderOrJson_js_1 = require("../server/initDataProviderOrJson.js");
var context_js_1 = require("../src/context.js");
var isOfType_js_1 = require("../src/isOfType.js");
/**
 * Applies migration scripts to update the database schema.
 *
 * @param options - Configuration options for applying migrations.
 * @param options.migrations - An object containing the migration scripts, each keyed by a unique identifier.
 * @param options.dataProvider - The data provider instance or a function returning a promise of the data provider.
 * @param options.migrationsTable - (Optional) The name of the table that tracks applied migrations. Default is '__remult_migrations_version'.
 * @param options.endConnection - (Optional) Determines whether to close the database connection after applying migrations. Default is false.
 * @param options.beforeMigration - (Optional) A callback function that is called before each migration is applied. Receives an object with the migration index.
 * @param options.afterMigration - (Optional) A callback function that is called after each migration is applied. Receives an object with the migration index and the duration of the migration.
 * @see [Migrations](https://remult.dev/docs/migrations.html)
 */
function migrate(options) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var migrationTableName, dataProvider, prev, VersionInfo_1, steps_1;
        var _this = this;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    migrationTableName = options.migrationsTable || '__remult_migrations_version';
                    return [4 /*yield*/, (0, initDataProviderOrJson_js_1.initDataProviderOrJson)(options.dataProvider)];
                case 1:
                    dataProvider = _a.sent();
                    prev = index_js_1.remult.dataProvider;
                    index_js_1.remult.dataProvider = dataProvider;
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, , 6, 7]);
                    VersionInfo_1 = /** @class */ (function (_super) {
                        tslib_1.__extends(VersionInfo, _super);
                        function VersionInfo() {
                            var _this = _super.apply(this, tslib_1.__spreadArray([], tslib_1.__read(arguments), false)) || this;
                            _this.version = -1;
                            return _this;
                        }
                        return VersionInfo;
                    }(index_js_1.IdEntity));
                    (0, index_js_1.describeClass)(VersionInfo_1, (0, index_js_1.Entity)(migrationTableName), {
                        version: index_js_1.Fields.integer(),
                    });
                    steps_1 = Object.entries(options.migrations).sort(function (_a, _b) {
                        var _c = tslib_1.__read(_a, 1), a = _c[0];
                        var _d = tslib_1.__read(_b, 1), b = _d[0];
                        return parseInt(a) - parseInt(b);
                    });
                    if (!dataProvider.ensureSchema) return [3 /*break*/, 4];
                    return [4 /*yield*/, dataProvider.ensureSchema([
                            new index_js_1.Remult(dataProvider).repo(VersionInfo_1).metadata,
                        ])];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4: return [4 /*yield*/, (0, context_js_1.doTransaction)(index_js_1.remult, function (dp) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                        var repo, v, steps_2, steps_2_1, _a, stepText, action, step, startTime, utils, err_1, e_1_1;
                        var e_1, _b;
                        var _this = this;
                        return tslib_1.__generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    repo = new index_js_1.Remult(dataProvider).repo(VersionInfo_1, dp);
                                    return [4 /*yield*/, repo.findFirst()];
                                case 1:
                                    v = _c.sent();
                                    if (!v) {
                                        v = repo.create();
                                        v.version = -1;
                                    }
                                    _c.label = 2;
                                case 2:
                                    _c.trys.push([2, 15, 16, 17]);
                                    steps_2 = tslib_1.__values(steps_1), steps_2_1 = steps_2.next();
                                    _c.label = 3;
                                case 3:
                                    if (!!steps_2_1.done) return [3 /*break*/, 14];
                                    _a = tslib_1.__read(steps_2_1.value, 2), stepText = _a[0], action = _a[1];
                                    step = parseInt(stepText);
                                    if (step < 0)
                                        throw new Error('Migration step number must be a non-negative integer');
                                    if (v.version >= step)
                                        return [3 /*break*/, 13];
                                    if (!options.beforeMigration) return [3 /*break*/, 5];
                                    return [4 /*yield*/, options.beforeMigration({ index: step })];
                                case 4:
                                    _c.sent();
                                    _c.label = 5;
                                case 5:
                                    startTime = Date.now();
                                    console.info('Executing migration step ' + step);
                                    console.time('Completed migration step ' + step);
                                    _c.label = 6;
                                case 6:
                                    _c.trys.push([6, 10, , 11]);
                                    utils = {
                                        sql: function (sql) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                            return tslib_1.__generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0: return [4 /*yield*/, (0, isOfType_js_1.cast)(dp, 'execute').execute(sql)];
                                                    case 1: return [2 /*return*/, _a.sent()];
                                                }
                                            });
                                        }); },
                                    };
                                    return [4 /*yield*/, action(utils)];
                                case 7:
                                    _c.sent();
                                    if (!options.afterMigration) return [3 /*break*/, 9];
                                    return [4 /*yield*/, options.afterMigration({
                                            index: step,
                                            duration: Date.now() - startTime,
                                        })];
                                case 8:
                                    _c.sent();
                                    _c.label = 9;
                                case 9:
                                    console.timeEnd('Completed migration step ' + step);
                                    return [3 /*break*/, 11];
                                case 10:
                                    err_1 = _c.sent();
                                    console.error('Failed to execute migration step ' + step);
                                    console.error(err_1);
                                    throw err_1;
                                case 11:
                                    v.version = step;
                                    return [4 /*yield*/, v.save()];
                                case 12:
                                    _c.sent();
                                    _c.label = 13;
                                case 13:
                                    steps_2_1 = steps_2.next();
                                    return [3 /*break*/, 3];
                                case 14: return [3 /*break*/, 17];
                                case 15:
                                    e_1_1 = _c.sent();
                                    e_1 = { error: e_1_1 };
                                    return [3 /*break*/, 17];
                                case 16:
                                    try {
                                        if (steps_2_1 && !steps_2_1.done && (_b = steps_2.return)) _b.call(steps_2);
                                    }
                                    finally { if (e_1) throw e_1.error; }
                                    return [7 /*endfinally*/];
                                case 17: return [2 /*return*/];
                            }
                        });
                    }); })];
                case 5:
                    _a.sent();
                    return [3 /*break*/, 7];
                case 6:
                    index_js_1.remult.dataProvider = prev;
                    return [7 /*endfinally*/];
                case 7:
                    if (!(options.endConnection && (0, isOfType_js_1.isOfType)(dataProvider, 'end'))) return [3 /*break*/, 9];
                    return [4 /*yield*/, dataProvider.end()];
                case 8:
                    _a.sent();
                    _a.label = 9;
                case 9: return [2 /*return*/];
            }
        });
    });
}

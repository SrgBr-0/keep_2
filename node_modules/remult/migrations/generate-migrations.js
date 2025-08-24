"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateMigrations = generateMigrations;
var tslib_1 = require("tslib");
var path_1 = tslib_1.__importDefault(require("path"));
var fs_1 = tslib_1.__importDefault(require("fs"));
var compare_migration_snapshots_js_1 = require("./compare-migration-snapshots.js");
var update_migrations_ts_file_js_1 = require("./update-migrations-ts-file.js");
var migration_types_js_1 = require("./migration-types.js");
var isOfType_js_1 = require("../src/isOfType.js");
var initDataProviderOrJson_js_1 = require("../server/initDataProviderOrJson.js");
/**
 * Generates migration scripts based on changes in entities.
 *
 * @param options - Configuration options for generating migrations.
 * @param options.entities - An array of entity classes whose changes will be included in the migration.
 * @param options.dataProvider - The data provider instance or a function returning a promise of the data provider.
 * @param options.migrationsFolder - (Optional) The path to the folder where migration scripts will be stored. Default is 'src/migrations'.
 * @param options.snapshotFile - (Optional) The path to the file where the snapshot of the last known state will be stored. Default is 'migrations-snapshot.json' in the `migrationsFolder`.
 * @param options.migrationsTSFile - (Optional) The path to the TypeScript file where the generated migrations will be written. Default is 'migrations.ts' in the `migrationsFolder`.
 * @param options.endConnection - (Optional) Determines whether to close the database connection after generating migrations. Default is false.
 * @see [Migrations](https://remult.dev/docs/migrations.html)
 */
function generateMigrations(options) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var migrationDir, snapshotFileName, migrationsTSFilename, dataProvider, _a, _b, p, snapshot, hasSql, steps, code, migrationBuilder, reporter;
        var e_1, _c;
        return tslib_1.__generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    migrationDir = options.migrationsFolder || path_1.default.join(process.cwd(), 'src/migrations');
                    snapshotFileName = options.snapshotFile || path_1.default.join(migrationDir, 'migrations-snapshot.json');
                    migrationsTSFilename = options.migrationsTSFile || path_1.default.join(migrationDir, 'migrations.ts');
                    return [4 /*yield*/, (0, initDataProviderOrJson_js_1.initDataProviderOrJson)(options.dataProvider)];
                case 1:
                    dataProvider = _d.sent();
                    try {
                        for (_a = tslib_1.__values([snapshotFileName, migrationsTSFilename]), _b = _a.next(); !_b.done; _b = _a.next()) {
                            p = _b.value;
                            if (!fs_1.default.existsSync(path_1.default.dirname(p))) {
                                fs_1.default.mkdirSync(path_1.default.dirname(p), { recursive: true });
                            }
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                    snapshot = (0, compare_migration_snapshots_js_1.emptySnapshot)();
                    if (fs_1.default.existsSync(snapshotFileName)) {
                        snapshot = JSON.parse(fs_1.default.readFileSync(snapshotFileName).toString());
                    }
                    hasSql = false;
                    steps = [];
                    code = {
                        //https://marketplace.visualstudio.com/items?itemName=qufiwefefwoyn.inline-sql-syntax
                        addSql: function (sql) {
                            steps.push('await sql(`--sql\n' + sql + '`)');
                            hasSql = true;
                        },
                        addTypescriptCode: function (code) { return steps.push(code); },
                        addComment: function (comment) {
                            return steps.push(comment.indexOf('\n') >= 0 ? "/*".concat(comment, "*/") : "// ".concat(comment));
                        },
                    };
                    migrationBuilder = new migration_types_js_1.DefaultMigrationBuilder(code);
                    if ((0, isOfType_js_1.isOfType)(dataProvider, 'provideMigrationBuilder')) {
                        migrationBuilder = new migration_types_js_1.DefaultMigrationBuilder(code, dataProvider.provideMigrationBuilder(code));
                    }
                    reporter = function (what) { return console.log('[generateMigrations] ' + what); };
                    return [4 /*yield*/, (0, compare_migration_snapshots_js_1.compareMigrationSnapshot)({
                            entities: options.entities,
                            snapshot: snapshot,
                            reporter: reporter,
                            migrationBuilder: migrationBuilder,
                        })];
                case 2:
                    snapshot = _d.sent();
                    if (!steps.length) return [3 /*break*/, 4];
                    return [4 /*yield*/, (0, update_migrations_ts_file_js_1.updateMigrationsFile)(migrationsTSFilename, [
                            "async (".concat(hasSql ? '{sql}' : '', ")=>{\n").concat(steps.join('\n'), "\n}"),
                        ])];
                case 3:
                    _d.sent();
                    return [3 /*break*/, 5];
                case 4:
                    reporter('No changes detected');
                    _d.label = 5;
                case 5:
                    fs_1.default.writeFileSync(snapshotFileName, JSON.stringify(snapshot, null, 2));
                    if (!(options.endConnection && (0, isOfType_js_1.isOfType)(dataProvider, 'end'))) return [3 /*break*/, 7];
                    return [4 /*yield*/, dataProvider.end()];
                case 6:
                    _d.sent();
                    _d.label = 7;
                case 7: return [2 /*return*/, steps.length > 0];
            }
        });
    });
}

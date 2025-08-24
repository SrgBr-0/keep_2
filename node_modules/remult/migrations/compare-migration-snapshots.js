"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareMigrationSnapshot = compareMigrationSnapshot;
exports.emptySnapshot = emptySnapshot;
var tslib_1 = require("tslib");
var index_js_1 = require("../index.js");
var filter_consumer_bridge_to_sql_request_js_1 = require("../src/filter/filter-consumer-bridge-to-sql-request.js");
function compareMigrationSnapshot(_a) {
    return tslib_1.__awaiter(this, arguments, void 0, function (_b) {
        var processedEntities, entities_1, entities_1_1, entity, meta, e, entitySnapshot, createColumns, processedColumns, _c, _d, field, columnDbName, column, e_1_1, _e, _f, columnDbName, e_2_1, e_3_1, _g, _h, entityDbName, e_4_1;
        var e_3, _j, e_1, _k, e_2, _l, e_4, _m;
        var entities = _b.entities, snapshot = _b.snapshot, migrationBuilder = _b.migrationBuilder, reporter = _b.reporter;
        return tslib_1.__generator(this, function (_o) {
            switch (_o.label) {
                case 0:
                    snapshot = JSON.parse(JSON.stringify(snapshot));
                    processedEntities = new Set();
                    _o.label = 1;
                case 1:
                    _o.trys.push([1, 23, 24, 25]);
                    entities_1 = tslib_1.__values(entities), entities_1_1 = entities_1.next();
                    _o.label = 2;
                case 2:
                    if (!!entities_1_1.done) return [3 /*break*/, 22];
                    entity = entities_1_1.value;
                    meta = (0, index_js_1.repo)(entity).metadata;
                    return [4 /*yield*/, (0, filter_consumer_bridge_to_sql_request_js_1.dbNamesOf)(meta, function (x) { return x; })];
                case 3:
                    e = _o.sent();
                    processedEntities.add(e.$entityName);
                    if (!(0, filter_consumer_bridge_to_sql_request_js_1.shouldCreateEntity)(meta, e)) return [3 /*break*/, 21];
                    entitySnapshot = snapshot.entities[e.$entityName];
                    createColumns = true;
                    if (!!entitySnapshot) return [3 /*break*/, 5];
                    createColumns = false;
                    reporter('create table ' + e.$entityName);
                    return [4 /*yield*/, migrationBuilder.createTable(meta)];
                case 4:
                    _o.sent();
                    entitySnapshot = snapshot.entities[e.$entityName] = {
                        key: meta.key,
                        className: meta.entityType.name,
                        columns: {},
                    };
                    _o.label = 5;
                case 5:
                    processedColumns = new Set();
                    _o.label = 6;
                case 6:
                    _o.trys.push([6, 12, 13, 14]);
                    _c = (e_1 = void 0, tslib_1.__values(meta.fields)), _d = _c.next();
                    _o.label = 7;
                case 7:
                    if (!!_d.done) return [3 /*break*/, 11];
                    field = _d.value;
                    if (!!(0, filter_consumer_bridge_to_sql_request_js_1.shouldNotCreateField)(field, e)) return [3 /*break*/, 10];
                    columnDbName = e.$dbNameOf(field);
                    processedColumns.add(columnDbName);
                    column = entitySnapshot.columns[columnDbName];
                    if (!!column) return [3 /*break*/, 10];
                    if (!createColumns) return [3 /*break*/, 9];
                    reporter('add column ' + e.$entityName + '.' + columnDbName);
                    return [4 /*yield*/, migrationBuilder.addColumn(meta, field)];
                case 8:
                    _o.sent();
                    _o.label = 9;
                case 9:
                    entitySnapshot.columns[columnDbName] = { key: field.key };
                    _o.label = 10;
                case 10:
                    _d = _c.next();
                    return [3 /*break*/, 7];
                case 11: return [3 /*break*/, 14];
                case 12:
                    e_1_1 = _o.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 14];
                case 13:
                    try {
                        if (_d && !_d.done && (_k = _c.return)) _k.call(_c);
                    }
                    finally { if (e_1) throw e_1.error; }
                    return [7 /*endfinally*/];
                case 14:
                    _o.trys.push([14, 19, 20, 21]);
                    _e = (e_2 = void 0, tslib_1.__values(Object.keys(entitySnapshot.columns))), _f = _e.next();
                    _o.label = 15;
                case 15:
                    if (!!_f.done) return [3 /*break*/, 18];
                    columnDbName = _f.value;
                    if (!!processedColumns.has(columnDbName)) return [3 /*break*/, 17];
                    reporter('remove column ' + e.$entityName + '.' + columnDbName);
                    return [4 /*yield*/, migrationBuilder.removeColumn(e.$entityName, columnDbName)];
                case 16:
                    _o.sent();
                    delete entitySnapshot.columns[columnDbName];
                    _o.label = 17;
                case 17:
                    _f = _e.next();
                    return [3 /*break*/, 15];
                case 18: return [3 /*break*/, 21];
                case 19:
                    e_2_1 = _o.sent();
                    e_2 = { error: e_2_1 };
                    return [3 /*break*/, 21];
                case 20:
                    try {
                        if (_f && !_f.done && (_l = _e.return)) _l.call(_e);
                    }
                    finally { if (e_2) throw e_2.error; }
                    return [7 /*endfinally*/];
                case 21:
                    entities_1_1 = entities_1.next();
                    return [3 /*break*/, 2];
                case 22: return [3 /*break*/, 25];
                case 23:
                    e_3_1 = _o.sent();
                    e_3 = { error: e_3_1 };
                    return [3 /*break*/, 25];
                case 24:
                    try {
                        if (entities_1_1 && !entities_1_1.done && (_j = entities_1.return)) _j.call(entities_1);
                    }
                    finally { if (e_3) throw e_3.error; }
                    return [7 /*endfinally*/];
                case 25:
                    _o.trys.push([25, 30, 31, 32]);
                    _g = tslib_1.__values(Object.keys(snapshot.entities)), _h = _g.next();
                    _o.label = 26;
                case 26:
                    if (!!_h.done) return [3 /*break*/, 29];
                    entityDbName = _h.value;
                    if (!!processedEntities.has(entityDbName)) return [3 /*break*/, 28];
                    reporter('remove table ' + entityDbName);
                    return [4 /*yield*/, migrationBuilder.removeTable(entityDbName)];
                case 27:
                    _o.sent();
                    delete snapshot.entities[entityDbName];
                    _o.label = 28;
                case 28:
                    _h = _g.next();
                    return [3 /*break*/, 26];
                case 29: return [3 /*break*/, 32];
                case 30:
                    e_4_1 = _o.sent();
                    e_4 = { error: e_4_1 };
                    return [3 /*break*/, 32];
                case 31:
                    try {
                        if (_h && !_h.done && (_m = _g.return)) _m.call(_g);
                    }
                    finally { if (e_4) throw e_4.error; }
                    return [7 /*endfinally*/];
                case 32: return [2 /*return*/, snapshot];
            }
        });
    });
}
function emptySnapshot() {
    return {
        version: 1,
        entities: {},
    };
}

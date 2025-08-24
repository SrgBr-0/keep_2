"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.relationInfoMemberInOptions = relationInfoMemberInOptions;
exports.getRelationInfo = getRelationInfo;
exports.getRelationFieldInfo = getRelationFieldInfo;
exports.verifyFieldRelationInfo = verifyFieldRelationInfo;
var tslib_1 = require("tslib");
var CompoundIdField_js_1 = require("../CompoundIdField.js");
function relationInfoMemberInOptions(toEntityType, type) {
    var _a;
    return _a = {},
        _a[relationInfoMember] = {
            toType: toEntityType,
            type: type,
        },
        _a;
}
var relationInfoMember = Symbol.for('relationInfo');
/**
 * @deprecated
 */
function getRelationInfo(options) {
    return options === null || options === void 0 ? void 0 : options[relationInfoMember];
}
var fieldRelationInfo = Symbol.for('fieldRelationInfo');
function getRelationFieldInfo(field) {
    if (!field)
        return undefined;
    return field[fieldRelationInfo];
}
function verifyFieldRelationInfo(repo, remult, dp) {
    var e_1, _a;
    var _loop_1 = function (field) {
        var r = getRelationInfo(field.options);
        if (r) {
            if (!field[fieldRelationInfo]) {
                var toEntity = r.toType();
                var toRepo_1 = remult.repo(toEntity, dp);
                var options_1 = field.options;
                field[fieldRelationInfo] = {
                    type: r.type,
                    toEntity: toEntity,
                    options: options_1,
                    toRepo: toRepo_1,
                    getFields: function () {
                        var e_2, _a, _b, _c;
                        var relationField = options_1.field;
                        var relFields = {
                            fields: options_1.fields,
                            compoundIdField: undefined,
                        };
                        function buildError(what) {
                            return Error("Error for relation: \"".concat(repo.metadata.key, ".").concat(field.key, "\", ") +
                                what);
                        }
                        var hasFields = function () { return relationField || relFields.fields; };
                        if (r.type === 'toMany' && !hasFields()) {
                            try {
                                for (var _d = (e_2 = void 0, tslib_1.__values(toRepo_1.fields.toArray())), _e = _d.next(); !_e.done; _e = _d.next()) {
                                    var fieldInOtherRepo = _e.value;
                                    if (!hasFields()) {
                                        var reverseRel = getRelationFieldInfo(fieldInOtherRepo);
                                        var relOp = fieldInOtherRepo.options;
                                        if (reverseRel)
                                            if (reverseRel.toEntity === repo.metadata.entityType)
                                                if (reverseRel.type === 'reference') {
                                                    relationField = fieldInOtherRepo.key;
                                                }
                                                else if (reverseRel.type === 'toOne') {
                                                    if (relOp.field) {
                                                        relationField = relOp.field;
                                                    }
                                                    else if (relOp.fields) {
                                                        var fields = {};
                                                        for (var key in relOp.fields) {
                                                            if (Object.prototype.hasOwnProperty.call(relOp.fields, key)) {
                                                                var keyInMyTable = relOp.fields[key];
                                                                fields[keyInMyTable] = key;
                                                            }
                                                        }
                                                        relFields.fields = fields;
                                                    }
                                                }
                                    }
                                }
                            }
                            catch (e_2_1) { e_2 = { error: e_2_1 }; }
                            finally {
                                try {
                                    if (_e && !_e.done && (_a = _d.return)) _a.call(_d);
                                }
                                finally { if (e_2) throw e_2.error; }
                            }
                            if (!hasFields())
                                throw buildError("No matching field found on target \"".concat(toRepo_1.metadata.key, "\". Please specify field/fields"));
                        }
                        function requireField(field, meta) {
                            var result = meta.fields.find(field);
                            if (!result)
                                throw buildError("Field \"".concat(field, "\" was not found in \"").concat(meta.key, "\"."));
                            return result;
                        }
                        if (r.type === 'reference') {
                            relationField = field.key;
                        }
                        if (relationField) {
                            if (r.type === 'toOne' || r.type === 'reference') {
                                if (toRepo_1.metadata.idMetadata.field instanceof CompoundIdField_js_1.CompoundIdField) {
                                    relFields.compoundIdField = relationField;
                                }
                                else
                                    relFields.fields = (_b = {},
                                        _b[toRepo_1.metadata.idMetadata.field.key] = relationField,
                                        _b);
                            }
                            else {
                                if (repo.metadata.idMetadata.field instanceof CompoundIdField_js_1.CompoundIdField) {
                                    relFields.compoundIdField = relationField;
                                }
                                else
                                    relFields.fields = (_c = {},
                                        _c[relationField] = repo.metadata.idMetadata.field.key,
                                        _c);
                            }
                        }
                        for (var key in relFields.fields) {
                            if (Object.prototype.hasOwnProperty.call(relFields.fields, key)) {
                                requireField(key, toRepo_1.metadata);
                                requireField(relFields.fields[key], repo.metadata);
                            }
                        }
                        return relFields;
                    },
                };
            }
        }
    };
    try {
        for (var _b = tslib_1.__values(repo.fields.toArray()), _c = _b.next(); !_c.done; _c = _b.next()) {
            var field = _c.value;
            _loop_1(field);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_1) throw e_1.error; }
    }
}

import { CompoundIdField } from '../CompoundIdField.js';
export function relationInfoMemberInOptions(toEntityType, type) {
    return {
        [relationInfoMember]: {
            toType: toEntityType,
            type: type,
        },
    };
}
const relationInfoMember = Symbol.for('relationInfo');
/**
 * @deprecated
 */
export function getRelationInfo(options) {
    return options?.[relationInfoMember];
}
const fieldRelationInfo = Symbol.for('fieldRelationInfo');
export function getRelationFieldInfo(field) {
    if (!field)
        return undefined;
    return field[fieldRelationInfo];
}
export function verifyFieldRelationInfo(repo, remult, dp) {
    for (const field of repo.fields.toArray()) {
        const r = getRelationInfo(field.options);
        if (r) {
            if (!field[fieldRelationInfo]) {
                const toEntity = r.toType();
                const toRepo = remult.repo(toEntity, dp);
                const options = field.options;
                field[fieldRelationInfo] = {
                    type: r.type,
                    toEntity,
                    options,
                    toRepo,
                    getFields: () => {
                        let relationField = options.field;
                        let relFields = {
                            fields: options.fields,
                            compoundIdField: undefined,
                        };
                        function buildError(what) {
                            return Error(`Error for relation: "${repo.metadata.key}.${field.key}", ` +
                                what);
                        }
                        let hasFields = () => relationField || relFields.fields;
                        if (r.type === 'toMany' && !hasFields()) {
                            for (const fieldInOtherRepo of toRepo.fields.toArray()) {
                                if (!hasFields()) {
                                    const reverseRel = getRelationFieldInfo(fieldInOtherRepo);
                                    const relOp = fieldInOtherRepo.options;
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
                                                    let fields = {};
                                                    for (const key in relOp.fields) {
                                                        if (Object.prototype.hasOwnProperty.call(relOp.fields, key)) {
                                                            const keyInMyTable = relOp.fields[key];
                                                            fields[keyInMyTable] = key;
                                                        }
                                                    }
                                                    relFields.fields = fields;
                                                }
                                            }
                                }
                            }
                            if (!hasFields())
                                throw buildError(`No matching field found on target "${toRepo.metadata.key}". Please specify field/fields`);
                        }
                        function requireField(field, meta) {
                            const result = meta.fields.find(field);
                            if (!result)
                                throw buildError(`Field "${field}" was not found in "${meta.key}".`);
                            return result;
                        }
                        if (r.type === 'reference') {
                            relationField = field.key;
                        }
                        if (relationField) {
                            if (r.type === 'toOne' || r.type === 'reference') {
                                if (toRepo.metadata.idMetadata.field instanceof CompoundIdField) {
                                    relFields.compoundIdField = relationField;
                                }
                                else
                                    relFields.fields = {
                                        [toRepo.metadata.idMetadata.field.key]: relationField,
                                    };
                            }
                            else {
                                if (repo.metadata.idMetadata.field instanceof CompoundIdField) {
                                    relFields.compoundIdField = relationField;
                                }
                                else
                                    relFields.fields = {
                                        [relationField]: repo.metadata.idMetadata.field.key,
                                    };
                            }
                        }
                        for (const key in relFields.fields) {
                            if (Object.prototype.hasOwnProperty.call(relFields.fields, key)) {
                                requireField(key, toRepo.metadata);
                                requireField(relFields.fields[key], repo.metadata);
                            }
                        }
                        return relFields;
                    },
                };
            }
        }
    }
}

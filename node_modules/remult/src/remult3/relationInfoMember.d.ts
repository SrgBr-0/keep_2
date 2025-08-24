import type { ClassType } from '../../classType.js';
import type { FieldMetadata, FieldOptions } from '../column-interfaces.js';
import type { Remult } from '../context.js';
import type { DataProvider } from '../data-interfaces.js';
import type { RelationOptions, Repository } from './remult3.js';
export declare function relationInfoMemberInOptions(toEntityType: () => ClassType<any>, type: RelationFieldInfo['type']): FieldOptions;
/**
 * @deprecated
 */
export declare function getRelationInfo(options: FieldOptions): RelationInfo;
/**
 * @deprecated
 */
export interface RelationInfo {
    toType: () => any;
    type: RelationFieldInfo['type'];
}
export declare function getRelationFieldInfo(field: FieldMetadata): RelationFieldInfo | undefined;
export interface RelationFieldInfo {
    type: 'reference' | 'toOne' | 'toMany';
    options: RelationOptions<unknown, unknown, unknown>;
    toEntity: any;
    toRepo: Repository<unknown>;
    getFields(): RelationFields;
}
export interface RelationFields {
    fields: Record<string, string>;
    compoundIdField: string | undefined;
}
export declare function verifyFieldRelationInfo(repo: Repository<unknown>, remult: Remult, dp: DataProvider): void;

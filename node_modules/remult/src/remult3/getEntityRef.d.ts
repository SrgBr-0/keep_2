import type { ClassType } from '../../classType.js';
import type { EntityOptionsFactory } from './RepositoryImplementation.js';
import type { EntityRef } from './remult3.js';
/**
 * Retrieves the EntityRef object associated with the specified entity instance.
 * The EntityRef provides methods for performing operations on the entity instance.
 * @param {entityType} entity - The entity instance.
 * @param {boolean} [throwException=true] - Indicates whether to throw an exception if the EntityRef object cannot be retrieved.
 * @returns {EntityRef<entityType>} The EntityRef object associated with the specified entity instance.
 * @throws {Error} If throwException is true and the EntityRef object cannot be retrieved.
 * @see [Active Record & EntityBase](https://remult.dev/docs/active-record)
 */
export declare function getEntityRef<entityType>(entity: entityType, throwException?: boolean): EntityRef<entityType>;
export declare const entityMember: unique symbol;
export declare const entityInfo: unique symbol;
export declare const entityInfo_key: unique symbol;
export declare function getEntitySettings<T>(entity: ClassType<T>, throwError?: boolean): EntityOptionsFactory | undefined;
export declare function getEntityKey(entity: ClassType<any>): string;

export { ArrayEntityDataProvider } from './src/data-providers/array-entity-data-provider.js';
export { EntityBase, ControllerBase, FieldType, getFields, ValueListFieldType, getValueList, ValueListInfo, CaptionTransformer, } from './src/remult3/RepositoryImplementation.js';
export { Entity } from './src/remult3/entity.js';
export { getEntityRef } from './src/remult3/getEntityRef.js';
export { Field, Fields, Relations, } from './src/remult3/Fields.js';
export { IdEntity } from './src/remult3/IdEntity.js';
export { describeClass, describeBackendMethods, describeEntity, } from './src/remult3/classDescribers.js';
export { EntityError, } from './src/data-interfaces.js'; //V
export { RestDataProvider } from './src/data-providers/rest-data-provider.js'; //V
export { InMemoryDataProvider } from './src/data-providers/in-memory-database.js'; //V
export { SqlDatabase } from './src/data-providers/sql-database.js'; //V
export { CustomSqlFilterBuilder, dbNamesOf, } from './src/filter/filter-consumer-bridge-to-sql-request.js';
export { JsonDataProvider, } from './src/data-providers/json-data-provider.js'; //V
export { JsonEntityOpfsStorage } from './src/data-providers/json-entity-opfs-storage.js';
export { JsonEntityIndexedDbStorage } from './src/data-providers/json-entity-indexed-db-data-provider.js';
//export * from './src/data-api'; //reconsider if to make internal
export { Controller, BackendMethod, ProgressListener, ForbiddenError, } from './src/server-action.js';
export { Allow, Remult, withRemult, isBackend, EventSource, } from './src/context.js';
export { Sort } from './src/sort.js';
export { CompoundIdField } from './src/CompoundIdField.js';
export { Filter, } from './src/filter/filter-interfaces.js';
export { UrlBuilder } from './urlBuilder.js';
export { Validators, valueValidator, createValidator, createValidatorWithArgs, createValueValidatorWithArgs, createValueValidator, } from './src/validators.js';
export { ValueConverters } from './src/valueConverters.js';
export { remult } from './src/remult-proxy.js';
import { remult } from './src/remult-proxy.js';
//export { getId } from './src/remult3/getId';
export { InMemoryLiveQueryStorage, } from './src/live-query/SubscriptionServer.js';
export { SubscriptionChannel, } from './src/live-query/SubscriptionChannel.js';
/**
 * A convenient shortcut function to quickly obtain a repository for a specific entity type in Remult.
 *
 * @param entity The entity class type for which you want to get a repository.
 * @returns A repository instance for the specified entity type.
 *
 * Example usage:
 * ```ts
 * await repo(Task).find()
 * await repo(Customer).insert()
 * ```
 */
export function repo(entity, dataProvider) {
    return remult.repo(entity, dataProvider);
}

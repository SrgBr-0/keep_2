"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionChannel = exports.InMemoryLiveQueryStorage = exports.remult = exports.ValueConverters = exports.createValueValidator = exports.createValueValidatorWithArgs = exports.createValidatorWithArgs = exports.createValidator = exports.valueValidator = exports.Validators = exports.UrlBuilder = exports.Filter = exports.CompoundIdField = exports.Sort = exports.EventSource = exports.isBackend = exports.withRemult = exports.Remult = exports.Allow = exports.ForbiddenError = exports.ProgressListener = exports.BackendMethod = exports.Controller = exports.JsonEntityIndexedDbStorage = exports.JsonEntityOpfsStorage = exports.JsonDataProvider = exports.dbNamesOf = exports.CustomSqlFilterBuilder = exports.SqlDatabase = exports.InMemoryDataProvider = exports.RestDataProvider = exports.EntityError = exports.describeEntity = exports.describeBackendMethods = exports.describeClass = exports.IdEntity = exports.Relations = exports.Fields = exports.Field = exports.getEntityRef = exports.Entity = exports.CaptionTransformer = exports.ValueListInfo = exports.getValueList = exports.ValueListFieldType = exports.getFields = exports.FieldType = exports.ControllerBase = exports.EntityBase = exports.ArrayEntityDataProvider = void 0;
exports.repo = repo;
var array_entity_data_provider_js_1 = require("./src/data-providers/array-entity-data-provider.js");
Object.defineProperty(exports, "ArrayEntityDataProvider", { enumerable: true, get: function () { return array_entity_data_provider_js_1.ArrayEntityDataProvider; } });
var RepositoryImplementation_js_1 = require("./src/remult3/RepositoryImplementation.js");
Object.defineProperty(exports, "EntityBase", { enumerable: true, get: function () { return RepositoryImplementation_js_1.EntityBase; } });
Object.defineProperty(exports, "ControllerBase", { enumerable: true, get: function () { return RepositoryImplementation_js_1.ControllerBase; } });
Object.defineProperty(exports, "FieldType", { enumerable: true, get: function () { return RepositoryImplementation_js_1.FieldType; } });
Object.defineProperty(exports, "getFields", { enumerable: true, get: function () { return RepositoryImplementation_js_1.getFields; } });
Object.defineProperty(exports, "ValueListFieldType", { enumerable: true, get: function () { return RepositoryImplementation_js_1.ValueListFieldType; } });
Object.defineProperty(exports, "getValueList", { enumerable: true, get: function () { return RepositoryImplementation_js_1.getValueList; } });
Object.defineProperty(exports, "ValueListInfo", { enumerable: true, get: function () { return RepositoryImplementation_js_1.ValueListInfo; } });
Object.defineProperty(exports, "CaptionTransformer", { enumerable: true, get: function () { return RepositoryImplementation_js_1.CaptionTransformer; } });
var entity_js_1 = require("./src/remult3/entity.js");
Object.defineProperty(exports, "Entity", { enumerable: true, get: function () { return entity_js_1.Entity; } });
var getEntityRef_js_1 = require("./src/remult3/getEntityRef.js");
Object.defineProperty(exports, "getEntityRef", { enumerable: true, get: function () { return getEntityRef_js_1.getEntityRef; } });
var Fields_js_1 = require("./src/remult3/Fields.js");
Object.defineProperty(exports, "Field", { enumerable: true, get: function () { return Fields_js_1.Field; } });
Object.defineProperty(exports, "Fields", { enumerable: true, get: function () { return Fields_js_1.Fields; } });
Object.defineProperty(exports, "Relations", { enumerable: true, get: function () { return Fields_js_1.Relations; } });
var IdEntity_js_1 = require("./src/remult3/IdEntity.js");
Object.defineProperty(exports, "IdEntity", { enumerable: true, get: function () { return IdEntity_js_1.IdEntity; } });
var classDescribers_js_1 = require("./src/remult3/classDescribers.js");
Object.defineProperty(exports, "describeClass", { enumerable: true, get: function () { return classDescribers_js_1.describeClass; } });
Object.defineProperty(exports, "describeBackendMethods", { enumerable: true, get: function () { return classDescribers_js_1.describeBackendMethods; } });
Object.defineProperty(exports, "describeEntity", { enumerable: true, get: function () { return classDescribers_js_1.describeEntity; } });
var data_interfaces_js_1 = require("./src/data-interfaces.js"); //V
Object.defineProperty(exports, "EntityError", { enumerable: true, get: function () { return data_interfaces_js_1.EntityError; } });
var rest_data_provider_js_1 = require("./src/data-providers/rest-data-provider.js"); //V
Object.defineProperty(exports, "RestDataProvider", { enumerable: true, get: function () { return rest_data_provider_js_1.RestDataProvider; } });
var in_memory_database_js_1 = require("./src/data-providers/in-memory-database.js"); //V
Object.defineProperty(exports, "InMemoryDataProvider", { enumerable: true, get: function () { return in_memory_database_js_1.InMemoryDataProvider; } });
var sql_database_js_1 = require("./src/data-providers/sql-database.js"); //V
Object.defineProperty(exports, "SqlDatabase", { enumerable: true, get: function () { return sql_database_js_1.SqlDatabase; } });
var filter_consumer_bridge_to_sql_request_js_1 = require("./src/filter/filter-consumer-bridge-to-sql-request.js");
Object.defineProperty(exports, "CustomSqlFilterBuilder", { enumerable: true, get: function () { return filter_consumer_bridge_to_sql_request_js_1.CustomSqlFilterBuilder; } });
Object.defineProperty(exports, "dbNamesOf", { enumerable: true, get: function () { return filter_consumer_bridge_to_sql_request_js_1.dbNamesOf; } });
var json_data_provider_js_1 = require("./src/data-providers/json-data-provider.js"); //V
Object.defineProperty(exports, "JsonDataProvider", { enumerable: true, get: function () { return json_data_provider_js_1.JsonDataProvider; } });
var json_entity_opfs_storage_js_1 = require("./src/data-providers/json-entity-opfs-storage.js");
Object.defineProperty(exports, "JsonEntityOpfsStorage", { enumerable: true, get: function () { return json_entity_opfs_storage_js_1.JsonEntityOpfsStorage; } });
var json_entity_indexed_db_data_provider_js_1 = require("./src/data-providers/json-entity-indexed-db-data-provider.js");
Object.defineProperty(exports, "JsonEntityIndexedDbStorage", { enumerable: true, get: function () { return json_entity_indexed_db_data_provider_js_1.JsonEntityIndexedDbStorage; } });
//export * from './src/data-api'; //reconsider if to make internal
var server_action_js_1 = require("./src/server-action.js");
Object.defineProperty(exports, "Controller", { enumerable: true, get: function () { return server_action_js_1.Controller; } });
Object.defineProperty(exports, "BackendMethod", { enumerable: true, get: function () { return server_action_js_1.BackendMethod; } });
Object.defineProperty(exports, "ProgressListener", { enumerable: true, get: function () { return server_action_js_1.ProgressListener; } });
Object.defineProperty(exports, "ForbiddenError", { enumerable: true, get: function () { return server_action_js_1.ForbiddenError; } });
var context_js_1 = require("./src/context.js");
Object.defineProperty(exports, "Allow", { enumerable: true, get: function () { return context_js_1.Allow; } });
Object.defineProperty(exports, "Remult", { enumerable: true, get: function () { return context_js_1.Remult; } });
Object.defineProperty(exports, "withRemult", { enumerable: true, get: function () { return context_js_1.withRemult; } });
Object.defineProperty(exports, "isBackend", { enumerable: true, get: function () { return context_js_1.isBackend; } });
Object.defineProperty(exports, "EventSource", { enumerable: true, get: function () { return context_js_1.EventSource; } });
var sort_js_1 = require("./src/sort.js");
Object.defineProperty(exports, "Sort", { enumerable: true, get: function () { return sort_js_1.Sort; } });
var CompoundIdField_js_1 = require("./src/CompoundIdField.js");
Object.defineProperty(exports, "CompoundIdField", { enumerable: true, get: function () { return CompoundIdField_js_1.CompoundIdField; } });
var filter_interfaces_js_1 = require("./src/filter/filter-interfaces.js");
Object.defineProperty(exports, "Filter", { enumerable: true, get: function () { return filter_interfaces_js_1.Filter; } });
var urlBuilder_js_1 = require("./urlBuilder.js");
Object.defineProperty(exports, "UrlBuilder", { enumerable: true, get: function () { return urlBuilder_js_1.UrlBuilder; } });
var validators_js_1 = require("./src/validators.js");
Object.defineProperty(exports, "Validators", { enumerable: true, get: function () { return validators_js_1.Validators; } });
Object.defineProperty(exports, "valueValidator", { enumerable: true, get: function () { return validators_js_1.valueValidator; } });
Object.defineProperty(exports, "createValidator", { enumerable: true, get: function () { return validators_js_1.createValidator; } });
Object.defineProperty(exports, "createValidatorWithArgs", { enumerable: true, get: function () { return validators_js_1.createValidatorWithArgs; } });
Object.defineProperty(exports, "createValueValidatorWithArgs", { enumerable: true, get: function () { return validators_js_1.createValueValidatorWithArgs; } });
Object.defineProperty(exports, "createValueValidator", { enumerable: true, get: function () { return validators_js_1.createValueValidator; } });
var valueConverters_js_1 = require("./src/valueConverters.js");
Object.defineProperty(exports, "ValueConverters", { enumerable: true, get: function () { return valueConverters_js_1.ValueConverters; } });
var remult_proxy_js_1 = require("./src/remult-proxy.js");
Object.defineProperty(exports, "remult", { enumerable: true, get: function () { return remult_proxy_js_1.remult; } });
var remult_proxy_js_2 = require("./src/remult-proxy.js");
//export { getId } from './src/remult3/getId';
var SubscriptionServer_js_1 = require("./src/live-query/SubscriptionServer.js");
Object.defineProperty(exports, "InMemoryLiveQueryStorage", { enumerable: true, get: function () { return SubscriptionServer_js_1.InMemoryLiveQueryStorage; } });
var SubscriptionChannel_js_1 = require("./src/live-query/SubscriptionChannel.js");
Object.defineProperty(exports, "SubscriptionChannel", { enumerable: true, get: function () { return SubscriptionChannel_js_1.SubscriptionChannel; } });
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
function repo(entity, dataProvider) {
    return remult_proxy_js_2.remult.repo(entity, dataProvider);
}

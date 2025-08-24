"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.entityInfo_key = exports.entityInfo = exports.entityMember = void 0;
exports.getEntityRef = getEntityRef;
exports.getEntitySettings = getEntitySettings;
exports.getEntityKey = getEntityKey;
/**
 * Retrieves the EntityRef object associated with the specified entity instance.
 * The EntityRef provides methods for performing operations on the entity instance.
 * @param {entityType} entity - The entity instance.
 * @param {boolean} [throwException=true] - Indicates whether to throw an exception if the EntityRef object cannot be retrieved.
 * @returns {EntityRef<entityType>} The EntityRef object associated with the specified entity instance.
 * @throws {Error} If throwException is true and the EntityRef object cannot be retrieved.
 * @see [Active Record & EntityBase](https://remult.dev/docs/active-record)
 */
function getEntityRef(entity, throwException) {
    var _a;
    if (throwException === void 0) { throwException = true; }
    if (entity === undefined)
        throw new Error('entity is undefined');
    var x = entity[exports.entityMember];
    if (!x && throwException)
        throw new Error('item ' +
            (((_a = entity.constructor) === null || _a === void 0 ? void 0 : _a.name) || entity) +
            ' was not initialized using a context');
    return x;
}
exports.entityMember = Symbol.for('entityMember');
exports.entityInfo = Symbol.for('entityInfo');
exports.entityInfo_key = Symbol.for('entityInfo_key');
function getEntitySettings(entity, throwError) {
    if (throwError === void 0) { throwError = true; }
    if (entity === undefined)
        if (throwError) {
            throw new Error('Undefined is not an entity :)');
        }
        else
            return undefined;
    var info = entity[exports.entityInfo];
    if (!info && throwError)
        throw new Error(entity.prototype.constructor.name +
            " is not a known entity, did you forget to set @Entity() or did you forget to add the '@' before the call to Entity?");
    return info;
}
function getEntityKey(entity) {
    return entity[exports.entityInfo_key];
}

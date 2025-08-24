import { BackendMethod } from '../server-action.js';
import { Entity } from './entity.js';
export function describeClass(classType, classDescriber, members, staticMembers) {
    if (classDescriber)
        classDescriber(classType);
    for (const fieldKey in members) {
        if (Object.prototype.hasOwnProperty.call(members, fieldKey)) {
            const element = members[fieldKey];
            const prop = Object.getOwnPropertyDescriptor(classType.prototype, fieldKey);
            element(classType.prototype, fieldKey, prop);
            if (prop)
                Object.defineProperty(classType.prototype, fieldKey, prop);
        }
    }
    for (const staticFieldKey in staticMembers) {
        const staticElement = staticMembers[staticFieldKey];
        const prop = Object.getOwnPropertyDescriptor(classType, staticFieldKey);
        staticElement(classType, staticFieldKey, prop);
        if (prop)
            Object.defineProperty(classType, staticFieldKey, prop);
    }
}
export function describeBackendMethods(classType, backendMethods) {
    let result = {};
    for (const key in backendMethods) {
        if (Object.prototype.hasOwnProperty.call(backendMethods, key)) {
            const options = backendMethods[key];
            result[key] = BackendMethod(options);
        }
    }
    describeClass(classType, undefined, undefined, result);
}
export function describeEntity(classType, key, fields, options) {
    describeClass(classType, Entity(key, options), fields);
}

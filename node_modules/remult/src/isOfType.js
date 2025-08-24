"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isOfType = isOfType;
exports.cast = cast;
function isOfType(obj, checkMethod) {
    return typeof obj[checkMethod] !== 'undefined';
}
function cast(obj, checkMethod) {
    if (isOfType(obj, checkMethod)) {
        return obj;
    }
    throw new Error("Object is not of type ".concat(checkMethod.toString()));
}

export function isOfType(obj, checkMethod) {
    return typeof obj[checkMethod] !== 'undefined';
}
export function cast(obj, checkMethod) {
    if (isOfType(obj, checkMethod)) {
        return obj;
    }
    throw new Error(`Object is not of type ${checkMethod.toString()}`);
}

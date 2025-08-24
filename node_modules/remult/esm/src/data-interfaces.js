import { Sort } from './sort.js';
export function extractSort(sort) {
    if (sort instanceof Array) {
        let r = new Sort();
        sort.forEach((i) => {
            r.Segments.push(i);
        });
        return r;
    }
    return sort;
}
export class EntityError extends Error {
    constructor(errorInfo) {
        super(errorInfo.message);
        Object.assign(this, errorInfo);
    }
    modelState;
    stack;
    exception;
    httpStatusCode;
}

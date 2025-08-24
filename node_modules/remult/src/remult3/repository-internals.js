"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInternalKey = void 0;
exports.getRepositoryInternals = getRepositoryInternals;
function getRepositoryInternals(repo) {
    var x = repo;
    if (typeof x[exports.getInternalKey] === 'function')
        return x[exports.getInternalKey]();
    throw Error('Error getting repository internal from ' + repo);
}
exports.getInternalKey = Symbol.for('getInternal');

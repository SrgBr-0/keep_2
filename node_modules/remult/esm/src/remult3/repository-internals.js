export function getRepositoryInternals(repo) {
    const x = repo;
    if (typeof x[getInternalKey] === 'function')
        return x[getInternalKey]();
    throw Error('Error getting repository internal from ' + repo);
}
export const getInternalKey = Symbol.for('getInternal');

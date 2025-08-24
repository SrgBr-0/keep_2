import { findOptionsToJson } from '../data-providers/rest-data-provider.js';
import { getEntityRef } from './getEntityRef.js';
import { getRelationFieldInfo } from './relationInfoMember.js';
export class RelationLoader {
    entityLoaders = new Map();
    promises = [];
    load(rel, findOptions) {
        let e = this.entityLoaders.get(rel.entityType);
        if (!e) {
            this.entityLoaders.set(rel.entityType, (e = new EntityLoader(rel)));
        }
        const p = e.find(findOptions);
        this.promises.push(p);
        return p;
    }
    constructor() { }
    async resolveAll() {
        for (const entity of this.entityLoaders.values()) {
            for (const variation of entity.queries.values()) {
                variation.resolve();
            }
        }
        if (this.promises.length === 0)
            return;
        const x = this.promises;
        this.promises = [];
        await Promise.all(x);
        await this.resolveAll();
    }
}
class EntityLoader {
    rel;
    queries = new Map();
    find(findOptions) {
        const { where, ...options } = findOptionsToJson(findOptions, this.rel.metadata);
        const optionKeys = JSON.stringify(options);
        let q = this.queries.get(optionKeys);
        if (!q) {
            this.queries.set(optionKeys, (q = new QueryVariation(this.rel)));
        }
        return q.find(findOptions, where);
    }
    constructor(rel) {
        this.rel = rel;
    }
}
class QueryVariation {
    rel;
    find(findOptions, where) {
        const whereKey = JSON.stringify(where);
        let w = this.whereVariations.get(whereKey);
        if (!w) {
            const keys = Object.keys(where);
            if (keys.length === 1 &&
                typeof where[keys[0]] !== 'object' &&
                !findOptions.limit // because merging calls in that case may bring non more rows than the limit
            ) {
                let inVariation = this.pendingInStatements.get(keys[0]);
                if (!inVariation) {
                    this.pendingInStatements.set(keys[0], (inVariation = new PendingInStatements(this.rel, keys[0], findOptions)));
                }
                this.whereVariations.set(whereKey, (w = {
                    result: inVariation.find(where),
                }));
            }
            else {
                this.whereVariations.set(whereKey, (w = {
                    result: this.rel.find(findOptions),
                }));
            }
        }
        return w.result;
    }
    constructor(rel) {
        this.rel = rel;
    }
    resolve() {
        const statements = [...this.pendingInStatements.values()];
        this.pendingInStatements.clear();
        for (const statement of statements) {
            statement.resolve();
        }
    }
    pendingInStatements = new Map();
    whereVariations = new Map();
}
class PendingInStatements {
    rel;
    key;
    options;
    async resolve() {
        const values = [...this.values.values()];
        if (values.length == 1) {
            this.rel.find(this.options).then(values[0].resolve, values[0].reject);
            return;
        }
        var op = { ...this.options };
        op.where = { [this.key]: values.map((v) => v.value) };
        op.limit = 1000;
        op.page = 1;
        let vals = [];
        try {
            while (true) {
                const val = await this.rel.find(op);
                vals.push(...val);
                if (val.length < op.limit)
                    break;
                op.page++;
            }
            for (const value of this.values.values()) {
                value.resolve(vals.filter((x) => {
                    const ref = getEntityRef(x);
                    const field = ref.fields.find(this.key);
                    const rel = getRelationFieldInfo(field.metadata);
                    const val = rel?.type === 'reference'
                        ? field.getId()
                        : x[this.key];
                    return value.value == val;
                }));
            }
        }
        catch (err) {
            for (const value of this.values.values()) {
                value.reject(err);
            }
        }
    }
    find(where) {
        const val = where[this.key];
        let valHandler = this.values.get(val);
        if (!valHandler) {
            let resolve;
            let reject;
            let result = new Promise((resolve1, reject1) => {
                resolve = resolve1;
                reject = reject1;
            });
            this.values.set(val, (valHandler = {
                value: val,
                resolve: resolve,
                reject: reject,
                result,
            }));
        }
        return valHandler.result;
    }
    values = new Map();
    constructor(rel, key, options) {
        this.rel = rel;
        this.key = key;
        this.options = options;
    }
}

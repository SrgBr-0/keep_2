import { getEntityRef } from './remult3/getEntityRef.js';
import { getRepositoryInternals } from './remult3/repository-internals.js';
export function makeTitle(name) {
    // insert a space before all caps
    return (name
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        // Uppercase the first character
        .replace(/^./, (str) => str.toUpperCase())
        .replace('Email', 'eMail'));
}
export class LookupColumn {
    repository;
    isReferenceRelation;
    allowNull;
    toJson() {
        if (!this.storedItem)
            return undefined;
        if (this.item === null)
            return null;
        return this.repository.toJson(this.item);
    }
    setId(val) {
        if (this.repository.metadata.idMetadata.field.valueType == Number)
            val = +val;
        this.id = val;
    }
    waitLoadOf(id) {
        if (id === undefined || id === null)
            return null;
        return getRepositoryInternals(this.repository)._getCachedByIdAsync(id, false);
    }
    get(id) {
        if (id === undefined || id === null)
            return null;
        const result = getRepositoryInternals(this.repository)._getCachedById(id, this.isReferenceRelation);
        if (this.isReferenceRelation && !this.storedItem) {
            if (!this.allowNull && (this.id === 0 || this.id === ''))
                return null;
            return undefined;
        }
        return result;
    }
    storedItem;
    set(item) {
        if (item === null &&
            !this.allowNull &&
            this.isReferenceRelation &&
            (this.id == 0 || this.id == '')) {
            this.storedItem = { item: null };
            return;
        }
        this.storedItem = undefined;
        if (item) {
            if (typeof item === 'string' || typeof item === 'number')
                this.id = item;
            else {
                let eo = getEntityRef(item, false);
                if (eo && !this.isReferenceRelation) {
                    getRepositoryInternals(this.repository)._addToCache(item);
                    this.id = eo.getId();
                }
                else {
                    this.storedItem = { item };
                    this.id = item[this.repository.metadata.idMetadata.field.key];
                }
            }
        }
        else if (item === null) {
            this.id = null;
        }
        else {
            this.id = undefined;
        }
    }
    id;
    constructor(repository, isReferenceRelation, allowNull) {
        this.repository = repository;
        this.isReferenceRelation = isReferenceRelation;
        this.allowNull = allowNull;
    }
    get item() {
        if (this.storedItem)
            return this.storedItem.item;
        return this.get(this.id);
    }
    async waitLoad() {
        return this.waitLoadOf(this.id);
    }
}

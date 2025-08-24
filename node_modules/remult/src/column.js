"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LookupColumn = void 0;
exports.makeTitle = makeTitle;
var tslib_1 = require("tslib");
var getEntityRef_js_1 = require("./remult3/getEntityRef.js");
var repository_internals_js_1 = require("./remult3/repository-internals.js");
function makeTitle(name) {
    // insert a space before all caps
    return (name
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        // Uppercase the first character
        .replace(/^./, function (str) { return str.toUpperCase(); })
        .replace('Email', 'eMail'));
}
var LookupColumn = /** @class */ (function () {
    function LookupColumn(repository, isReferenceRelation, allowNull) {
        this.repository = repository;
        this.isReferenceRelation = isReferenceRelation;
        this.allowNull = allowNull;
    }
    LookupColumn.prototype.toJson = function () {
        if (!this.storedItem)
            return undefined;
        if (this.item === null)
            return null;
        return this.repository.toJson(this.item);
    };
    LookupColumn.prototype.setId = function (val) {
        if (this.repository.metadata.idMetadata.field.valueType == Number)
            val = +val;
        this.id = val;
    };
    LookupColumn.prototype.waitLoadOf = function (id) {
        if (id === undefined || id === null)
            return null;
        return (0, repository_internals_js_1.getRepositoryInternals)(this.repository)._getCachedByIdAsync(id, false);
    };
    LookupColumn.prototype.get = function (id) {
        if (id === undefined || id === null)
            return null;
        var result = (0, repository_internals_js_1.getRepositoryInternals)(this.repository)._getCachedById(id, this.isReferenceRelation);
        if (this.isReferenceRelation && !this.storedItem) {
            if (!this.allowNull && (this.id === 0 || this.id === ''))
                return null;
            return undefined;
        }
        return result;
    };
    LookupColumn.prototype.set = function (item) {
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
                var eo = (0, getEntityRef_js_1.getEntityRef)(item, false);
                if (eo && !this.isReferenceRelation) {
                    (0, repository_internals_js_1.getRepositoryInternals)(this.repository)._addToCache(item);
                    this.id = eo.getId();
                }
                else {
                    this.storedItem = { item: item };
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
    };
    Object.defineProperty(LookupColumn.prototype, "item", {
        get: function () {
            if (this.storedItem)
                return this.storedItem.item;
            return this.get(this.id);
        },
        enumerable: false,
        configurable: true
    });
    LookupColumn.prototype.waitLoad = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.waitLoadOf(this.id)];
            });
        });
    };
    return LookupColumn;
}());
exports.LookupColumn = LookupColumn;

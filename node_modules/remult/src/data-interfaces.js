"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityError = void 0;
exports.extractSort = extractSort;
var tslib_1 = require("tslib");
var sort_js_1 = require("./sort.js");
function extractSort(sort) {
    if (sort instanceof Array) {
        var r_1 = new sort_js_1.Sort();
        sort.forEach(function (i) {
            r_1.Segments.push(i);
        });
        return r_1;
    }
    return sort;
}
var EntityError = /** @class */ (function (_super) {
    tslib_1.__extends(EntityError, _super);
    function EntityError(errorInfo) {
        var _this = _super.call(this, errorInfo.message) || this;
        Object.assign(_this, errorInfo);
        return _this;
    }
    return EntityError;
}(Error));
exports.EntityError = EntityError;

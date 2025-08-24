"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.__updateEntityBasedOnWhere = __updateEntityBasedOnWhere;
var filter_interfaces_js_1 = require("../filter/filter-interfaces.js");
function __updateEntityBasedOnWhere(entityDefs, where, r) {
    var w = filter_interfaces_js_1.Filter.fromEntityFilter(entityDefs, where);
    var emptyFunction = function () { };
    if (w) {
        w.__applyToConsumer({
            custom: emptyFunction,
            databaseCustom: emptyFunction,
            containsCaseInsensitive: emptyFunction,
            notContainsCaseInsensitive: emptyFunction,
            startsWithCaseInsensitive: emptyFunction,
            endsWithCaseInsensitive: emptyFunction,
            isDifferentFrom: emptyFunction,
            isEqualTo: function (col, val) {
                r[col.key] = val;
            },
            isGreaterOrEqualTo: emptyFunction,
            isGreaterThan: emptyFunction,
            isIn: emptyFunction,
            isLessOrEqualTo: emptyFunction,
            isLessThan: emptyFunction,
            isNotNull: emptyFunction,
            isNull: emptyFunction,
            not: emptyFunction,
            or: emptyFunction,
        });
    }
}

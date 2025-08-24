"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.valueOrExpressionToValue = valueOrExpressionToValue;
function valueOrExpressionToValue(f) {
    if (typeof f === 'function') {
        var x = f;
        return x();
    }
    return f;
}

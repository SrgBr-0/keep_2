export function valueOrExpressionToValue(f) {
    if (typeof f === 'function') {
        let x = f;
        return x();
    }
    return f;
}

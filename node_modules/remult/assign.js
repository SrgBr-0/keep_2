"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assign = assign;
function assign(item, valuesToSet) {
    if (valuesToSet)
        Object.assign(item, valuesToSet);
    return item;
}

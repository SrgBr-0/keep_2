export function assign(item, valuesToSet) {
    if (valuesToSet)
        Object.assign(item, valuesToSet);
    return item;
}

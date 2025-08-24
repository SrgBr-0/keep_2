export function addValidator(validators, newValidator, atStart = false) {
    if (!newValidator)
        return validators;
    const newValidators = Array.isArray(newValidator)
        ? newValidator
        : [newValidator];
    const validatorsArray = Array.isArray(validators)
        ? validators
        : validators
            ? [validators]
            : [];
    return atStart
        ? [...newValidators, ...validatorsArray]
        : [...validatorsArray, ...newValidators];
}

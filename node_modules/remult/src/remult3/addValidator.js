"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addValidator = addValidator;
var tslib_1 = require("tslib");
function addValidator(validators, newValidator, atStart) {
    if (atStart === void 0) { atStart = false; }
    if (!newValidator)
        return validators;
    var newValidators = Array.isArray(newValidator)
        ? newValidator
        : [newValidator];
    var validatorsArray = Array.isArray(validators)
        ? validators
        : validators
            ? [validators]
            : [];
    return atStart
        ? tslib_1.__spreadArray(tslib_1.__spreadArray([], tslib_1.__read(newValidators), false), tslib_1.__read(validatorsArray), false) : tslib_1.__spreadArray(tslib_1.__spreadArray([], tslib_1.__read(validatorsArray), false), tslib_1.__read(newValidators), false);
}

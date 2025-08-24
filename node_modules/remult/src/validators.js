"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Validators = void 0;
exports.createValidator = createValidator;
exports.valueValidator = valueValidator;
exports.createValueValidator = createValueValidator;
exports.createValueValidatorWithArgs = createValueValidatorWithArgs;
exports.createValidatorWithArgs = createValidatorWithArgs;
exports.getEnumValues = getEnumValues;
var tslib_1 = require("tslib");
var internals_js_1 = require("../internals.js");
/**
 * Class containing various field validators.
 */
var Validators = /** @class */ (function () {
    function Validators() {
    }
    var _a;
    _a = Validators;
    /**
     * Validator to check if a value is required (not null or empty).
     */
    Validators.required = createValidator(function (_, e) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        return tslib_1.__generator(_a, function (_b) {
            return [2 /*return*/, !e.valueIsNull() &&
                    e.value !== '' &&
                    (e.value !== undefined || (0, internals_js_1.getRelationFieldInfo)(e.metadata) !== undefined)];
        });
    }); }, 'Should not be empty');
    /**
     * Validator to ensure a value is unique in the database.
     */
    Validators.unique = createValidator(function (_, e) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var _b;
        return tslib_1.__generator(_a, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!e.entityRef)
                        throw 'unique validation may only work on columns that are attached to an entity';
                    if (!(e.isBackend() && (e.isNew || e.valueChanged()))) return [3 /*break*/, 2];
                    return [4 /*yield*/, e.entityRef.repository.count((_b = {},
                            _b[e.metadata.key] = e.value,
                            _b))];
                case 1: return [2 /*return*/, ((_c.sent()) == 0)];
                case 2: return [2 /*return*/, true];
            }
        });
    }); }, 'already exists');
    /**
     * @deprecated use `unique` instead - it also runs only on the backend
     * Validator to ensure a value is unique on the backend.
     */
    Validators.uniqueOnBackend = createValidator(function (_, e) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var _b;
        return tslib_1.__generator(_a, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!(e.isBackend() && (e.isNew || e.valueChanged()))) return [3 /*break*/, 2];
                    return [4 /*yield*/, e.entityRef.repository.count((_b = {},
                            _b[e.metadata.key] = e.value,
                            _b))];
                case 1: return [2 /*return*/, ((_c.sent()) == 0)];
                case 2: return [2 /*return*/, true];
            }
        });
    }); }, _a.unique.defaultMessage);
    /**
     * Validator to check if a value matches a given regular expression.
     */
    Validators.regex = createValueValidatorWithArgs(function (val, regex) {
        return regex.test(val);
    });
    /**
     * Validator to check if a value is a valid email address.
     */
    Validators.email = createValueValidator(function (val) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val); }, 'Invalid Email');
    /**
     * Validator to check if a value is a valid URL.
     */
    Validators.url = createValueValidator(function (val) { return !!new URL(val); }, 'Invalid Url');
    /**
     * Validator to check if a value is one of the specified values.
     */
    Validators.in = createValueValidatorWithArgs(function (val, values) { return values.includes(val); }, function (values) {
        return "Value must be one of: ".concat(values
            .map(function (y) {
            return typeof y === 'object'
                ? (y === null || y === void 0 ? void 0 : y['id']) !== undefined
                    ? y === null || y === void 0 ? void 0 : y['id']
                    : y === null || y === void 0 ? void 0 : y.toString()
                : y;
        })
            .join(', '));
    });
    /**
     * Validator to check if a value is not null.
     */
    Validators.notNull = createValueValidator(function (val) { return val != null; }, 'Should not be null');
    /**
     * Validator to check if a value exists in a given enum.
     */
    Validators.enum = createValueValidatorWithArgs(function (value, enumObj) { return Object.values(enumObj).includes(value); }, function (enumObj) {
        return "Value must be one of ".concat(getEnumValues(enumObj).join(', '));
    });
    /**
     * Validator to check if a related value exists in the database.
     */
    Validators.relationExists = createValidator(function (_, e) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var _b;
        return tslib_1.__generator(_a, function (_c) {
            switch (_c.label) {
                case 0:
                    if (e.valueIsNull())
                        return [2 /*return*/, true];
                    if (!e.isBackend())
                        return [2 /*return*/, true];
                    _b = Boolean;
                    return [4 /*yield*/, e.load()];
                case 1: return [2 /*return*/, _b.apply(void 0, [_c.sent()])];
            }
        });
    }); }, 'Relation value does not exist');
    /**
     * Validator to check if a value is greater than or equal to a minimum value.
     */
    Validators.min = createValueValidatorWithArgs(function (val, minValue) { return val >= minValue; }, function (minValue) { return "Value must be bigger than or equal to ".concat(minValue); });
    /**
     * Validator to check if a value is less than or equal to a maximum value.
     */
    Validators.max = createValueValidatorWithArgs(function (val, maxValue) { return val <= maxValue; }, function (maxValue) { return "Value must be smaller than or equal to ".concat(maxValue); });
    /**
     * Validator to check if a string's length is less than or equal to a maximum length.
     */
    Validators.maxLength = createValueValidatorWithArgs(function (val, maxLength) { return val.length <= maxLength; }, function (maxLength) { return "Value must be at most ".concat(maxLength, " characters"); });
    /**
     * Validator to check if a string's length is greater than or equal to a minimum length.
     */
    Validators.minLength = createValueValidatorWithArgs(function (val, minLength) { return val.length >= minLength; }, function (maxLength) { return "Value must be at least ".concat(maxLength, " characters"); });
    /**
    * Validator to check if a value is within a specified range.
    */
    Validators.range = createValueValidatorWithArgs(function (val, _b) {
        var _c = tslib_1.__read(_b, 2), minValue = _c[0], maxValue = _c[1];
        return val >= minValue && val <= maxValue;
    }, function (_b) {
        var _c = tslib_1.__read(_b, 2), minValue = _c[0], maxValue = _c[1];
        return "Value must be between ".concat(minValue, " and ").concat(maxValue);
    });
    Validators.defaultMessage = 'Invalid value';
    return Validators;
}());
exports.Validators = Validators;
/**
 * Function to create a validator with a custom validation function.
 */
function createValidator(validate, defaultMessage) {
    var _this = this;
    var validation = function (entity, e, message) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var valid;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, validate(entity, e)];
                case 1:
                    valid = _b.sent();
                    if (typeof valid === 'string' && valid.length > 0)
                        e.error = valid;
                    else if (!valid)
                        e.error =
                            (typeof message === 'function' && message(entity, e, undefined)) ||
                                message ||
                                (typeof defaultMessage === 'function' &&
                                    defaultMessage(entity, e, undefined)) ||
                                defaultMessage ||
                                Validators.defaultMessage;
                    return [2 /*return*/];
            }
        });
    }); };
    var result = function (entityOrMessage, e, message) {
        if (typeof entityOrMessage === 'string' ||
            entityOrMessage === 'function' ||
            (entityOrMessage === undefined && e === undefined)) {
            return function (entity, e, message) { return tslib_1.__awaiter(_this, void 0, void 0, function () { return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, validation(entity, e, entityOrMessage || message)];
                    case 1: return [2 /*return*/, _b.sent()];
                }
            }); }); };
        }
        return validation(entityOrMessage, e, message);
    };
    Object.defineProperty(result, 'defaultMessage', {
        get: function () {
            return defaultMessage;
        },
        set: function (val) {
            defaultMessage = val;
        },
        enumerable: true,
    });
    //@ts-ignore
    return Object.assign(result, {
        withMessage: function (message) {
            return function (entity, e) { return tslib_1.__awaiter(_this, void 0, void 0, function () { return tslib_1.__generator(this, function (_b) {
                return [2 /*return*/, result(entity, e, message)];
            }); }); };
        },
    });
}
/**
 * Function to create a value validator.
 */
function valueValidator(validate, defaultMessage) {
    return function (entity, e) {
        return validate(e.value) || defaultMessage || false;
    };
}
/**
 * Function to create a value validator with arguments.
 */
function createValueValidator(validate, defaultMessage) {
    return createValidator(function (_, e) {
        if (e.value === undefined || e.value === null)
            return true;
        return validate(e.value);
    }, defaultMessage);
}
/**
 * Function to create a value validator with arguments and a custom message.
 */
function createValueValidatorWithArgs(validate, defaultMessage) {
    var result = createValidatorWithArgsInternal(function (_, e, args) {
        if (e.value === undefined || e.value === null)
            return true;
        return validate(e.value, args);
    }, function (_, e, args) {
        return (typeof defaultMessage === 'function' && defaultMessage(args)) ||
            defaultMessage;
    }, true);
    return Object.assign(function (entity, e) { return result(entity, e); }, {
        get defaultMessage() {
            return defaultMessage;
        },
        set defaultMessage(val) {
            defaultMessage = val;
        },
    });
}
/**
 * Function to create a validator with arguments and a custom message.
 */
function createValidatorWithArgs(validate, defaultMessage) {
    return createValidatorWithArgsInternal(validate, defaultMessage);
}
function createValidatorWithArgsInternal(validate, defaultMessage, isValueValidator) {
    var _this = this;
    if (isValueValidator === void 0) { isValueValidator = false; }
    var result = function (args, message) {
        return function (entity, e) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var valid;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, validate(entity, e, args)];
                    case 1:
                        valid = _b.sent();
                        if (typeof valid === 'string')
                            e.error = valid;
                        else if (!valid)
                            e.error = message
                                ? typeof message === 'function'
                                    ? isValueValidator
                                        ? message(args)
                                        : message(entity, e, args)
                                    : message
                                : defaultMessage
                                    ? typeof defaultMessage === 'function'
                                        ? defaultMessage(entity, e, args)
                                        : defaultMessage
                                    : Validators.defaultMessage;
                        return [2 /*return*/];
                }
            });
        }); };
    };
    return Object.assign(result, {
        get defaultMessage() {
            return defaultMessage;
        },
        set defaultMessage(val) {
            defaultMessage = val;
        },
    });
}
/**
 * Function to get the values of an enum.
 */
function getEnumValues(enumObj) {
    return Object.values(enumObj).filter(function (x) { return typeof enumObj[x] !== 'number'; });
}

import { getRelationFieldInfo } from '../internals.js';
/**
 * Class containing various field validators.
 */
export class Validators {
    /**
     * Validator to check if a value is required (not null or empty).
     */
    static required = createValidator(async (_, e) => !e.valueIsNull() &&
        e.value !== '' &&
        (e.value !== undefined || getRelationFieldInfo(e.metadata) !== undefined), 'Should not be empty');
    /**
     * Validator to ensure a value is unique in the database.
     */
    static unique = createValidator(async (_, e) => {
        if (!e.entityRef)
            throw 'unique validation may only work on columns that are attached to an entity';
        if (e.isBackend() && (e.isNew || e.valueChanged())) {
            return ((await e.entityRef.repository.count({
                [e.metadata.key]: e.value,
            })) == 0);
        }
        else
            return true;
    }, 'already exists');
    /**
     * @deprecated use `unique` instead - it also runs only on the backend
     * Validator to ensure a value is unique on the backend.
     */
    static uniqueOnBackend = createValidator(async (_, e) => {
        if (e.isBackend() && (e.isNew || e.valueChanged())) {
            return ((await e.entityRef.repository.count({
                [e.metadata.key]: e.value,
            })) == 0);
        }
        else
            return true;
    }, Validators.unique.defaultMessage);
    /**
     * Validator to check if a value matches a given regular expression.
     */
    static regex = createValueValidatorWithArgs((val, regex) => regex.test(val));
    /**
     * Validator to check if a value is a valid email address.
     */
    static email = createValueValidator((val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), 'Invalid Email');
    /**
     * Validator to check if a value is a valid URL.
     */
    static url = createValueValidator((val) => !!new URL(val), 'Invalid Url');
    /**
     * Validator to check if a value is one of the specified values.
     */
    static in = createValueValidatorWithArgs((val, values) => values.includes(val), (values) => `Value must be one of: ${values
        .map((y) => typeof y === 'object'
        ? y?.['id'] !== undefined
            ? y?.['id']
            : y?.toString()
        : y)
        .join(', ')}`);
    /**
     * Validator to check if a value is not null.
     */
    static notNull = createValueValidator((val) => val != null, 'Should not be null');
    /**
     * Validator to check if a value exists in a given enum.
     */
    static enum = createValueValidatorWithArgs((value, enumObj) => Object.values(enumObj).includes(value), (enumObj) => `Value must be one of ${getEnumValues(enumObj).join(', ')}`);
    /**
     * Validator to check if a related value exists in the database.
     */
    static relationExists = createValidator(async (_, e) => {
        if (e.valueIsNull())
            return true;
        if (!e.isBackend())
            return true;
        return Boolean(await e.load());
    }, 'Relation value does not exist');
    /**
     * Validator to check if a value is greater than or equal to a minimum value.
     */
    static min = createValueValidatorWithArgs((val, minValue) => val >= minValue, (minValue) => `Value must be bigger than or equal to ${minValue}`);
    /**
     * Validator to check if a value is less than or equal to a maximum value.
     */
    static max = createValueValidatorWithArgs((val, maxValue) => val <= maxValue, (maxValue) => `Value must be smaller than or equal to ${maxValue}`);
    /**
     * Validator to check if a string's length is less than or equal to a maximum length.
     */
    static maxLength = createValueValidatorWithArgs((val, maxLength) => val.length <= maxLength, (maxLength) => `Value must be at most ${maxLength} characters`);
    /**
     * Validator to check if a string's length is greater than or equal to a minimum length.
     */
    static minLength = createValueValidatorWithArgs((val, minLength) => val.length >= minLength, (maxLength) => `Value must be at least ${maxLength} characters`);
    /**
    * Validator to check if a value is within a specified range.
    */
    static range = createValueValidatorWithArgs((val, [minValue, maxValue]) => val >= minValue && val <= maxValue, ([minValue, maxValue]) => `Value must be between ${minValue} and ${maxValue}`);
    static defaultMessage = 'Invalid value';
}
/**
 * Function to create a validator with a custom validation function.
 */
export function createValidator(validate, defaultMessage) {
    const validation = async (entity, e, message) => {
        const valid = await validate(entity, e);
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
    };
    const result = (entityOrMessage, e, message) => {
        if (typeof entityOrMessage === 'string' ||
            entityOrMessage === 'function' ||
            (entityOrMessage === undefined && e === undefined)) {
            return async (entity, e, message) => await validation(entity, e, entityOrMessage || message);
        }
        return validation(entityOrMessage, e, message);
    };
    Object.defineProperty(result, 'defaultMessage', {
        get: () => {
            return defaultMessage;
        },
        set: (val) => {
            defaultMessage = val;
        },
        enumerable: true,
    });
    //@ts-ignore
    return Object.assign(result, {
        withMessage: (message) => async (entity, e) => result(entity, e, message),
    });
}
/**
 * Function to create a value validator.
 */
export function valueValidator(validate, defaultMessage) {
    return (entity, e) => validate(e.value) || defaultMessage || false;
}
/**
 * Function to create a value validator with arguments.
 */
export function createValueValidator(validate, defaultMessage) {
    return createValidator((_, e) => {
        if (e.value === undefined || e.value === null)
            return true;
        return validate(e.value);
    }, defaultMessage);
}
/**
 * Function to create a value validator with arguments and a custom message.
 */
export function createValueValidatorWithArgs(validate, defaultMessage) {
    const result = createValidatorWithArgsInternal((_, e, args) => {
        if (e.value === undefined || e.value === null)
            return true;
        return validate(e.value, args);
    }, (_, e, args) => (typeof defaultMessage === 'function' && defaultMessage(args)) ||
        defaultMessage, true);
    return Object.assign((entity, e) => result(entity, e), {
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
export function createValidatorWithArgs(validate, defaultMessage) {
    return createValidatorWithArgsInternal(validate, defaultMessage);
}
function createValidatorWithArgsInternal(validate, defaultMessage, isValueValidator = false) {
    const result = (args, message) => async (entity, e) => {
        const valid = await validate(entity, e, args);
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
export function getEnumValues(enumObj) {
    return Object.values(enumObj).filter((x) => typeof enumObj[x] !== 'number');
}

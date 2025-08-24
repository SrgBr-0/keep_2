import type { FieldValidator } from './column-interfaces.js';
import type { ValidateFieldEvent } from './remult3/remult3.js';
/**
 * Class containing various field validators.
 */
export declare class Validators {
    /**
     * Validator to check if a value is required (not null or empty).
     */
    static required: Validator<unknown>;
    /**
     * Validator to ensure a value is unique in the database.
     */
    static unique: Validator<unknown>;
    /**
     * @deprecated use `unique` instead - it also runs only on the backend
     * Validator to ensure a value is unique on the backend.
     */
    static uniqueOnBackend: Validator<unknown>;
    /**
     * Validator to check if a value matches a given regular expression.
     */
    static regex: ValidatorWithArgs<string, RegExp> & {
        defaultMessage: ValueValidationMessage<RegExp>;
    };
    /**
     * Validator to check if a value is a valid email address.
     */
    static email: Validator<string>;
    /**
     * Validator to check if a value is a valid URL.
     */
    static url: Validator<string>;
    /**
     * Validator to check if a value is one of the specified values.
     */
    static in: <T>(value: readonly T[], withMessage?: ValueValidationMessage<T[]>) => FieldValidator<unknown, T> & {
        withMessage: ValueValidationMessage<T[]>;
    };
    /**
     * Validator to check if a value is not null.
     */
    static notNull: Validator<unknown>;
    /**
     * Validator to check if a value exists in a given enum.
     */
    static enum: ValidatorWithArgs<unknown, unknown> & {
        defaultMessage: ValueValidationMessage<unknown>;
    };
    /**
     * Validator to check if a related value exists in the database.
     */
    static relationExists: Validator<unknown>;
    /**
     * Validator to check if a value is greater than or equal to a minimum value.
     */
    static min: ValidatorWithArgs<number, number> & {
        defaultMessage: ValueValidationMessage<number>;
    };
    /**
     * Validator to check if a value is less than or equal to a maximum value.
     */
    static max: ValidatorWithArgs<number, number> & {
        defaultMessage: ValueValidationMessage<number>;
    };
    /**
     * Validator to check if a string's length is less than or equal to a maximum length.
     */
    static maxLength: ValidatorWithArgs<string, number> & {
        defaultMessage: ValueValidationMessage<number>;
    };
    /**
     * Validator to check if a string's length is greater than or equal to a minimum length.
     */
    static minLength: ValidatorWithArgs<string, number> & {
        defaultMessage: ValueValidationMessage<number>;
    };
    /**
    * Validator to check if a value is within a specified range.
    */
    static range: ValidatorWithArgs<number, [number, number]> & {
        defaultMessage: ValueValidationMessage<[number, number]>;
    };
    static defaultMessage: string;
}
/**
 * Type representing a field validator with an optional message.
 */
export type Validator<valueType> = FieldValidator<unknown, valueType> & ((message?: ValidationMessage<valueType, undefined>) => FieldValidator<unknown, valueType>) & {
    defaultMessage: ValidationMessage<valueType, undefined>;
    /**
     * @deprecated use (message:string) instead - for example: Validators.required("Is needed")
     */
    withMessage(message: ValidationMessage<valueType, undefined>): FieldValidator<unknown, valueType>;
};
/**
 * Function to create a validator with a custom validation function.
 */
export declare function createValidator<valueType>(validate: (entity: any, e: ValidateFieldEvent<any, valueType>) => Promise<boolean | string> | boolean | string, defaultMessage?: ValidationMessage<valueType, undefined>): Validator<valueType>;
/**
 * Function to create a value validator.
 */
export declare function valueValidator<valueType>(validate: (value: valueType) => boolean | string | Promise<boolean | string>, defaultMessage?: string): (entity: any, e: ValidateFieldEvent<any, valueType>) => string | boolean | Promise<string | boolean>;
/**
 * Function to create a value validator with arguments.
 */
export declare function createValueValidator<valueType>(validate: (value: valueType) => boolean | string | Promise<boolean | string>, defaultMessage?: ValidationMessage<valueType, undefined>): Validator<valueType>;
/**
 * Function to create a value validator with arguments and a custom message.
 */
export declare function createValueValidatorWithArgs<valueType, argsType>(validate: (value: valueType, args: argsType) => boolean | string | Promise<boolean | string>, defaultMessage?: ValueValidationMessage<argsType>): ValidatorWithArgs<valueType, argsType> & {
    defaultMessage: ValueValidationMessage<argsType>;
};
/**
 * Type representing a validation message that can be a string or a function.
 */
export type ValueValidationMessage<argsType> = string | ((args: argsType) => string);
/**
 * Type representing a validation message with additional parameters.
 */
export type ValidationMessage<valueType, argsType> = string | ((entity: any, event: ValidateFieldEvent<any, valueType>, args: argsType) => string);
/**
 * Type representing a validator with arguments.
 */
export type ValidatorWithArgs<valueType, argsType> = (args: argsType, message?: ValidationMessage<valueType, argsType>) => FieldValidator<unknown, valueType>;
/**
 * Function to create a validator with arguments and a custom message.
 */
export declare function createValidatorWithArgs<valueType, argsType>(validate: (entity: any, e: ValidateFieldEvent<any, valueType>, args: argsType) => Promise<boolean | string> | boolean | string, defaultMessage: ValidationMessage<valueType, argsType>): ValidatorWithArgs<valueType, argsType> & {
    defaultMessage: ValidationMessage<valueType, argsType>;
};
/**
 * Function to get the values of an enum.
 */
export declare function getEnumValues<theEnum>(enumObj: theEnum): any[];

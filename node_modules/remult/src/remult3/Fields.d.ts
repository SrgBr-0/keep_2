import type { ClassType } from '../../classType.js';
import type { FieldOptions } from '../column-interfaces.js';
import type { Remult } from '../context.js';
import type { FindOptions, RelationOptions, ClassFieldDecorator, ClassFieldDecoratorContextStub } from './remult3.js';
export declare class Fields {
    /**
     * Stored as a JSON.stringify - to store as json use Fields.json
     */
    static object<entityType = unknown, valueType = unknown>(...options: (FieldOptions<entityType, valueType> | ((options: FieldOptions<entityType, valueType>, remult: Remult) => void))[]): ClassFieldDecorator<entityType, valueType | undefined>;
    static json<entityType = unknown, valueType = unknown>(...options: (FieldOptions<entityType, valueType> | ((options: FieldOptions<entityType, valueType>, remult: Remult) => void))[]): ClassFieldDecorator<entityType, valueType | undefined>;
    static dateOnly<entityType = unknown>(...options: (FieldOptions<entityType, Date> | ((options: FieldOptions<entityType, Date>, remult: Remult) => void))[]): ClassFieldDecorator<entityType, Date | undefined>;
    static date<entityType = unknown>(...options: (FieldOptions<entityType, Date> | ((options: FieldOptions<entityType, Date>, remult: Remult) => void))[]): ClassFieldDecorator<entityType, Date | undefined>;
    static integer<entityType = unknown>(...options: (FieldOptions<entityType, number> | ((options: FieldOptions<entityType, number>, remult: Remult) => void))[]): ClassFieldDecorator<entityType, number | undefined>;
    static autoIncrement<entityType = unknown>(...options: (FieldOptions<entityType, number> | ((options: FieldOptions<entityType, number>, remult: Remult) => void))[]): ClassFieldDecorator<entityType, number | undefined>;
    static number<entityType = unknown>(...options: (FieldOptions<entityType, number> | ((options: FieldOptions<entityType, number>, remult: Remult) => void))[]): ClassFieldDecorator<entityType, number | undefined>;
    static createdAt<entityType = unknown>(...options: (FieldOptions<entityType, Date> | ((options: FieldOptions<entityType, Date>, remult: Remult) => void))[]): ClassFieldDecorator<entityType, Date | undefined>;
    static updatedAt<entityType = unknown>(...options: (FieldOptions<entityType, Date> | ((options: FieldOptions<entityType, Date>, remult: Remult) => void))[]): ClassFieldDecorator<entityType, Date | undefined>;
    static uuid<entityType = unknown>(...options: (FieldOptions<entityType, string> | ((options: FieldOptions<entityType, string>, remult: Remult) => void))[]): ClassFieldDecorator<entityType, string | undefined>;
    /**
     * A CUID (Collision Resistant Unique Identifier) field.
     * This id value is determined on the backend on insert, and can't be updated through the API.
     * The CUID is generated using the `@paralleldrive/cuid2` npm package.
     */
    static cuid<entityType = unknown>(...options: (FieldOptions<entityType, string> | ((options: FieldOptions<entityType, string>, remult: Remult) => void))[]): ClassFieldDecorator<entityType, string | undefined>;
    /**
   * Defines a field that can hold a value from a specified set of string literals.
   * @param {() => readonly valueType[]} optionalValues - A function that returns an array of allowed string literals.
   * @returns {ClassFieldDecorator<entityType, valueType | undefined>} - A class field decorator.
   *
   * @example
   
   * class MyEntity {
   *   .@Fields.literal(() => ['open', 'closed', 'frozen', 'in progress'] as const)
   *   status: 'open' | 'closed' | 'frozen' | 'in progress' = 'open';
   * }
   
   *
   * // This defines a field `status` in `MyEntity` that can only hold the values 'open', 'closed', 'frozen', or 'in progress'.
   *
   * @example
   * // For better reusability and maintainability:
   
   * const statuses = ['open', 'closed', 'frozen', 'in progress'] as const;
   * type StatusType = typeof statuses[number];
   *
   * class MyEntity {
   *   .@Fields.literal(() => statuses)
   *   status: StatusType = 'open';
   * }
   
   *
   * // This approach allows easy management and updates of the allowed values for the `status` field.
   */
    static literal<entityType = unknown, valueType extends string = string>(optionalValues: () => readonly valueType[], ...options: (StringFieldOptions<entityType, valueType> | ((options: StringFieldOptions<entityType, valueType>, remult: Remult) => void))[]): ClassFieldDecorator<entityType, valueType | undefined>;
    static enum<entityType = unknown, theEnum = unknown>(enumType: () => theEnum, ...options: (FieldOptions<entityType, theEnum[keyof theEnum]> | ((options: FieldOptions<entityType, theEnum[keyof theEnum]>, remult: Remult) => void))[]): ClassFieldDecorator<entityType, theEnum[keyof theEnum] | undefined>;
    static string<entityType = unknown, valueType = string>(...options: (StringFieldOptions<entityType, valueType> | ((options: StringFieldOptions<entityType, valueType>, remult: Remult) => void))[]): ClassFieldDecorator<entityType, valueType | undefined>;
    static boolean<entityType = unknown>(...options: (FieldOptions<entityType, boolean> | ((options: FieldOptions<entityType, boolean>, remult: Remult) => void))[]): ClassFieldDecorator<entityType, boolean | undefined>;
}
export declare class Relations {
    /**
     * Define a to-one relation between entities, indicating a one-to-one relationship.
     * If no field or fields are provided, it will automatically create a field in the database
     * to represent the relation.
     *
     * @param toEntityType A function that returns the target entity type.
     * @param options (Optional): An object containing options for configuring the to-one relation.
     * @returns A decorator function to apply the to-one relation to an entity field.
     *
     * Example usage:
     * ```
     * @Relations.toOne(() => Customer)
     * customer?: Customer;
     * ```
     * ```
     * Fields.string()
     * customerId?: string;
     *
     * @Relations.toOne(() => Customer, "customerId")
     * customer?: Customer;
     * ```
     * ```
     * Fields.string()
     * customerId?: string;
     *
     * @Relations.toOne(() => Customer, {
     *   field: "customerId",
     *   defaultIncluded: true
     * })
     * customer?: Customer;
     * ```
     * ```
     * Fields.string()
     * customerId?: string;
     *
     * @Relations.toOne(() => Customer, {
     *   fields: {
     *     customerId: "id",
     *   },
     * })
     * customer?: Customer;
     * ```
     */
    static toOne<entityType, toEntityType>(toEntityType: () => ClassType<toEntityType>, options?: (FieldOptions<entityType, toEntityType> & Pick<RelationOptions<entityType, toEntityType, any, any>, 'defaultIncluded'>) | RelationOptions<entityType, toEntityType, entityType> | keyof entityType): (target: any, context: ClassFieldDecoratorContextStub<entityType, toEntityType | undefined> | string, c?: any) => void;
    /**
     * Define a toMany relation between entities, indicating a one-to-many relationship.
     * This method allows you to establish a relationship where one entity can have multiple related entities.
     *
     * @param toEntityType A function that returns the target entity type.
     * @param fieldInToEntity (Optional) The field in the target entity that represents the relation.
     *                       Use this if you want to specify a custom field name for the relation.
     * @returns A decorator function to apply the toMany relation to an entity field.
     *
     * Example usage:
     * ```
     * @Relations.toMany(() => Order)
     * orders?: Order[];
     *
     * // or with a custom field name:
     * @Relations.toMany(() => Order, "customerId")
     * orders?: Order[];
     * ```
     */
    static toMany<entityType, toEntityType>(toEntityType: () => ClassType<toEntityType>, fieldInToEntity?: keyof toEntityType): ClassFieldDecorator<entityType, toEntityType[] | undefined>;
    /**
     * Define a toMany relation between entities, indicating a one-to-many relationship.
     * This method allows you to establish a relationship where one entity can have multiple related entities.
     * You can also specify various options to customize the relation and control related data retrieval.
     *
     * @param toEntityType A function that returns the target entity type.
     * @param options An object containing options for configuring the toMany relation.
     *                - field (Optional): The field in the target entity that represents the relation.
     *                  Use this if you want to specify a custom field name for the relation.
     *                - findOptions (Optional): Customize the options for finding related entities.
     *                  You can set limits, order, where conditions, and more.
     * @returns A decorator function to apply the toMany relation to an entity field.
     *
     * Example usage:
     * ```
     * @Relations.toMany(() => Order, {
     *   field: "customerOrders",
     *   findOptions: {
     *     limit: 10,
     *     orderBy: { amount: "desc" },
     *     where: { completed: true },
     *   },
     * })
     * orders?: Order[];
     * ```
     */
    static toMany<entityType, toEntityType>(toEntityType: () => ClassType<toEntityType>, options: RelationOptions<entityType, toEntityType, toEntityType, FindOptions<toEntityType>>): ClassFieldDecorator<entityType, toEntityType[] | undefined>;
}
/**Decorates fields that should be used as fields.
 * for more info see: [Field Types](https://remult.dev/docs/field-types.html)
 *
 * FieldOptions can be set in two ways:
 * @example
 * // as an object
 * @Fields.string({ includeInApi:false })
 * title='';
 * @example
 * // as an arrow function that receives `remult` as a parameter
 * @Fields.string((options,remult) => options.includeInApi = true)
 * title='';
 */
export declare function Field<entityType = unknown, valueType = unknown>(valueType: (() => valueType extends number ? Number : valueType extends string ? String : valueType extends boolean ? Boolean : ClassType<valueType>) | undefined, ...options: (FieldOptions<entityType, valueType> | ((options: FieldOptions<entityType, valueType>, remult: Remult) => void))[]): (target: any, context: ClassFieldDecoratorContextStub<entityType, valueType | undefined> | string, c?: any) => void;
export interface StringFieldOptions<entityType = unknown, valueType = string> extends FieldOptions<entityType, valueType> {
    maxLength?: number;
    minLength?: number;
}
export declare function checkTarget(target: any): void;

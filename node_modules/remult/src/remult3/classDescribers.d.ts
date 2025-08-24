import type { ClassType } from '../../classType.js';
import type { EntityOptions } from '../entity.js';
import { type BackendMethodOptions } from '../server-action.js';
type Descriptor<T = unknown> = (a: T, b: string, c?: any) => void;
type FieldsDescriptor<T> = T extends new (...args: any[]) => infer R ? {
    [K in keyof R]?: Descriptor;
} : never;
type StaticMemberDescriptors<T> = {
    [K in keyof T]?: Descriptor;
};
export declare function describeClass<classType>(classType: classType, classDescriber: ((x: any, context?: any) => any) | undefined, members?: FieldsDescriptor<classType> | undefined, staticMembers?: StaticMemberDescriptors<classType>): void;
export declare function describeBackendMethods<T>(classType: T, backendMethods: {
    [K in keyof T]?: BackendMethodOptions<unknown>;
}): void;
export declare function describeEntity<entityType extends ClassType<any>>(classType: entityType, key: string, fields: FieldsDescriptor<entityType>, options?: EntityOptions<InstanceType<entityType>>): void;
export {};

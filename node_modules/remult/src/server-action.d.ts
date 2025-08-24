import 'reflect-metadata';
import type { AllowedForInstance } from './context.js';
import { Remult } from './context.js';
import type { DataApiResponse } from './data-api.js';
import type { DataProvider, RestDataProviderHttpProvider } from './data-interfaces.js';
interface inArgs {
    args: any[];
}
interface result {
    data: any;
}
export declare abstract class Action<inParam, outParam> implements ActionInterface {
    private actionUrl;
    private queue;
    private allowed;
    constructor(actionUrl: string, queue: boolean, allowed: AllowedForInstance<any>);
    static apiUrlForJobStatus: string;
    run(pIn: inParam, baseUrl?: string, http?: RestDataProviderHttpProvider): Promise<outParam>;
    doWork: (args: any[], self: any, baseUrl?: string, http?: RestDataProviderHttpProvider) => Promise<any>;
    protected abstract execute(info: inParam, req: Remult, res: DataApiResponse): Promise<outParam>;
    __register(reg: (url: string, queue: boolean, allowed: AllowedForInstance<any>, what: (data: any, req: Remult, res: DataApiResponse) => void) => void): void;
}
export declare class ForbiddenError extends Error {
    constructor(message?: string);
    isForbiddenError: true;
}
export declare class myServerAction extends Action<inArgs, result> {
    private types;
    private options;
    originalMethod: (args: any[]) => any;
    constructor(name: string, types: () => any[], options: BackendMethodOptions<any>, originalMethod: (args: any[]) => any);
    protected execute(info: inArgs, remult: Remult, res: DataApiResponse): Promise<result>;
}
export interface BackendMethodOptions<type> {
    /**Determines when this `BackendMethod` can execute, see: [Allowed](https://remult.dev/docs/allowed.html)  */
    allowed: AllowedForInstance<type>;
    /** Used to determine the route for the BackendMethod.
     * @example
     * {allowed:true, apiPrefix:'someFolder/'}
     */
    apiPrefix?: string;
    /**
     * Controls whether this `BackendMethod` runs within a database transaction. If set to `true`, the method will either complete entirely or fail without making any partial changes. If set to `false`, the method will not be transactional and may result in partial changes if it fails.
     * @default true
     * @example
     * {allowed: true, transactional: false}
     */
    transactional?: boolean;
    /** EXPERIMENTAL: Determines if this method should be queued for later execution */
    queue?: boolean;
    /** EXPERIMENTAL: Determines if the user should be blocked while this `BackendMethod` is running*/
    blockUser?: boolean;
    paramTypes?: any[] | (() => any[]);
}
export declare function Controller(key: string): (target: any, context?: any) => any;
export interface ClassMethodDecoratorContextStub<This = unknown, Value extends (this: This, ...args: any) => any = (this: This, ...args: any) => any> {
    readonly kind: 'method';
    readonly name: string | symbol;
    readonly access: {
        has(object: This): boolean;
    };
}
/**
 * Decorator indicating that the decorated method runs on the backend.
 * It allows the method to be invoked from the frontend while ensuring that the execution happens on the server side.
 * By default, the method runs within a database transaction, meaning it will either complete entirely or fail without making any partial changes.
 * This behavior can be controlled using the `transactional` option in the `BackendMethodOptions`.
 *
 * For more details, see: [Backend Methods](https://remult.dev/docs/backendMethods.html).
 *
 * @param options - Configuration options for the backend method, including permissions, routing, and transactional behavior.
 *
 * @example
 * ```typescript
 * @BackendMethod({ allowed: true })
 * async someBackendMethod() {
 *   // method logic here
 * }
 * ```
 */
export declare function BackendMethod<type = unknown>(options: BackendMethodOptions<type>): (target: any, context: ClassMethodDecoratorContextStub<type> | string, descriptor?: any) => any;
export interface jobWasQueuedResult {
    queuedJobId?: string;
}
export interface queuedJobInfoResponse {
    done: boolean;
    result?: any;
    error?: any;
    progress?: number;
}
export declare class ProgressListener {
    private res;
    constructor(res: DataApiResponse);
    progress(progress: number): void;
}
export declare function prepareArgsToSend(types: any[], args: any[]): any[];
export declare function prepareReceivedArgs(types: any[], args: any[], remult: Remult, ds: DataProvider, res: DataApiResponse): Promise<any[]>;
export declare const classBackendMethodsArray: unique symbol;
export interface ActionInterface {
    doWork: (args: any[], self: any, baseUrl?: string, http?: RestDataProviderHttpProvider) => Promise<any>;
    __register(reg: (url: string, queue: boolean, allowed: AllowedForInstance<any>, what: (data: any, req: Remult, res: DataApiResponse) => void) => void): void;
}
export {};

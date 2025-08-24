import 'reflect-metadata';
import { buildRestDataProvider } from './buildRestDataProvider.js';
import { ClassHelper, Remult, doTransaction, isBackend, setControllerSettings, } from './context.js';
import { SqlDatabase } from './data-providers/sql-database.js';
import { remult } from './remult-proxy.js';
import { decorateColumnSettings, getControllerRef, } from './remult3/RepositoryImplementation.js';
import { getEntityRef, getEntitySettings } from './remult3/getEntityRef.js';
import { serverActionField } from './server-action-info.js';
import { checkTarget } from './remult3/Fields.js';
import { remultStatic } from './remult-static.js';
export class Action {
    actionUrl;
    queue;
    allowed;
    constructor(actionUrl, queue, allowed) {
        this.actionUrl = actionUrl;
        this.queue = queue;
        this.allowed = allowed;
    }
    static apiUrlForJobStatus = 'jobStatusInQueue';
    async run(pIn, baseUrl, http) {
        if (baseUrl === undefined)
            baseUrl = remult.apiClient.url;
        if (!http)
            http = buildRestDataProvider(remult.apiClient.httpClient);
        let r = await http.post(baseUrl + '/' + this.actionUrl, pIn);
        let p = r;
        if (p && p.queuedJobId) {
            let progress = remultStatic.actionInfo.startBusyWithProgress();
            try {
                let runningJob;
                await remultStatic.actionInfo.runActionWithoutBlockingUI(async () => {
                    while (!runningJob || !runningJob.done) {
                        if (runningJob)
                            await new Promise((res) => setTimeout(() => {
                                res(undefined);
                            }, 200));
                        runningJob = await http.post(baseUrl + '/' + Action.apiUrlForJobStatus, { queuedJobId: r.queuedJobId });
                        if (runningJob.progress) {
                            progress.progress(runningJob.progress);
                        }
                    }
                });
                if (runningJob.error)
                    throw runningJob.error;
                progress.progress(1);
                return runningJob.result;
            }
            finally {
                progress.close();
            }
        }
        else
            return r;
    }
    doWork;
    __register(reg) {
        reg(this.actionUrl, this.queue, this.allowed, async (d, req, res) => {
            try {
                var r = await this.execute(d, req, res);
                res.success(r);
            }
            catch (err) {
                if (err.isForbiddenError)
                    // got a problem in next with instance of ForbiddenError  - so replaced it with this bool
                    res.forbidden();
                else
                    res.error(err, undefined);
            }
        });
    }
}
export class ForbiddenError extends Error {
    constructor(message = 'Forbidden') {
        super(message);
    }
    isForbiddenError = true;
}
export class myServerAction extends Action {
    types;
    options;
    originalMethod;
    constructor(name, types, options, originalMethod) {
        super(name, options.queue ?? false, options.allowed);
        this.types = types;
        this.options = options;
        this.originalMethod = originalMethod;
    }
    async execute(info, remult, res) {
        let result = { data: {} };
        let ds = remult.dataProvider;
        await decideTransaction(remult, this.options, async () => {
            if (!remult.isAllowedForInstance(undefined, this.options.allowed))
                throw new ForbiddenError();
            info.args = await prepareReceivedArgs(this.types(), info.args, remult, ds, res);
            try {
                result.data = await this.originalMethod(info.args);
            }
            catch (err) {
                throw err;
            }
        });
        return result;
    }
}
const classOptions = new Map();
export function Controller(key) {
    return function (target, context) {
        let r = target;
        classOptions.set(r, { key });
        setControllerSettings(target, { key });
        return target;
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
export function BackendMethod(options) {
    return (target, context, descriptor) => {
        const key = typeof context === 'string' ? context : context.name.toString();
        const originalMethod = descriptor ? descriptor.value : target;
        let result = originalMethod;
        checkTarget(target);
        function getTypes() {
            var types = typeof Reflect.getMetadata == 'function'
                ? Reflect.getMetadata('design:paramtypes', target, key)
                : [];
            if (options.paramTypes)
                types =
                    typeof options.paramTypes === 'function'
                        ? options.paramTypes()
                        : options.paramTypes;
            return types;
        }
        if (target.prototype !== undefined) {
            // if types are undefined - you've forgot to set: "emitDecoratorMetadata":true
            let serverAction = new myServerAction((options?.apiPrefix ? options.apiPrefix + '/' : '') + key, () => getTypes(), options, (args) => originalMethod.apply(undefined, args));
            serverAction.doWork = async (args, self, url, http) => {
                args = prepareArgsToSend(getTypes(), args);
                if (options.blockUser === false) {
                    return await remultStatic.actionInfo.runActionWithoutBlockingUI(async () => (await serverAction.run({ args }, url, http)).data);
                }
                else
                    return (await serverAction.run({ args }, url, http)).data;
            };
            result = async function (...args) {
                if (!isBackend()) {
                    return await serverAction.doWork(args, undefined);
                }
                else
                    return await originalMethod.apply(
                    //@ts-ignore
                    this, args);
            };
            registerAction(target, result);
            result[serverActionField] = serverAction;
            if (descriptor) {
                descriptor.value = result;
                return descriptor;
            }
            else
                return result;
        }
        let x = remultStatic.classHelpers.get(target.constructor);
        if (!x) {
            x = new ClassHelper();
            remultStatic.classHelpers.set(target.constructor, x);
        }
        let serverAction = {
            __register(reg) {
                let c = new Remult();
                for (const constructor of x.classes.keys()) {
                    let controllerOptions = x.classes.get(constructor);
                    if (!controllerOptions.key) {
                        controllerOptions.key = c.repo(constructor).metadata.key;
                    }
                    reg(controllerOptions.key +
                        '/' +
                        (options?.apiPrefix ? options.apiPrefix + '/' : '') +
                        key, options ? options.queue ?? false : false, options.allowed, async (d, req, res) => {
                        d.args = d.args.map((x) => (isCustomUndefined(x) ? undefined : x));
                        let allowed = options.allowed;
                        try {
                            let remult = req;
                            let r;
                            await decideTransaction(remult, options, async () => {
                                d.args = await prepareReceivedArgs(getTypes(), d.args, remult, remult.dataProvider, res);
                                if (remultStatic.allEntities.includes(constructor)) {
                                    let repo = remult.repo(constructor);
                                    let y;
                                    const rowInfo = d.rowInfo;
                                    if (rowInfo.isNewRow) {
                                        y = repo.create();
                                        let rowHelper = repo.getEntityRef(y);
                                        await rowHelper._updateEntityBasedOnApi(rowInfo.data);
                                    }
                                    else {
                                        let rows = await repo.find({
                                            where: {
                                                ...repo.metadata.idMetadata.getIdFilter(rowInfo.id),
                                                $and: [repo.metadata.options.apiPrefilter ?? {}],
                                            },
                                        });
                                        if (rows.length != 1)
                                            throw new Error('not found or too many matches');
                                        y = rows[0];
                                        await repo.getEntityRef(y)._updateEntityBasedOnApi(rowInfo.data);
                                    }
                                    if (!remult.isAllowedForInstance(y, allowed))
                                        throw new ForbiddenError();
                                    let defs = getEntityRef(y);
                                    await defs.__validateEntity();
                                    try {
                                        r = {
                                            result: await originalMethod.apply(y, d.args),
                                            rowInfo: {
                                                data: await defs.toApiJson(),
                                                isNewRow: defs.isNew(),
                                                wasChanged: defs.wasChanged(),
                                                id: defs.getOriginalId(),
                                            },
                                        };
                                    }
                                    catch (err) {
                                        throw defs.catchSaveErrors(err);
                                    }
                                }
                                else {
                                    let y = new constructor(remult, remult.dataProvider);
                                    let controllerRef = getControllerRef(y, remult);
                                    await controllerRef._updateEntityBasedOnApi(d.fields);
                                    if (!remult.isAllowedForInstance(y, allowed))
                                        throw new ForbiddenError();
                                    await controllerRef.__validateEntity();
                                    try {
                                        r = {
                                            result: await originalMethod.apply(y, d.args),
                                            fields: await controllerRef.toApiJson(),
                                        };
                                    }
                                    catch (err) {
                                        throw controllerRef.catchSaveErrors(err);
                                    }
                                }
                            });
                            res.success(r);
                        }
                        catch (err) {
                            if (err.isForbiddenError)
                                // got a problem in next with instance of ForbiddenError  - so replaced it with this bool
                                res.forbidden();
                            else
                                res.error(err, undefined);
                        }
                    });
                }
            },
            doWork: async function (args, self, baseUrl, http) {
                args = prepareArgsToSend(getTypes(), args);
                if (remultStatic.allEntities.includes(target.constructor)) {
                    let defs = getEntityRef(self);
                    await defs.__validateEntity();
                    let classOptions = x.classes.get(self.constructor);
                    if (!classOptions.key) {
                        classOptions.key = defs.repository.metadata.key + '_methods';
                    }
                    try {
                        let r = await new (class extends Action {
                            execute;
                        })(classOptions.key +
                            '/' +
                            (options?.apiPrefix ? options.apiPrefix + '/' : '') +
                            key, options?.queue ?? false, options.allowed).run({
                            args,
                            rowInfo: {
                                data: await defs.toApiJson(),
                                isNewRow: defs.isNew(),
                                wasChanged: defs.wasChanged(),
                                id: defs.getOriginalId(),
                            },
                        }, baseUrl, http);
                        await defs._updateEntityBasedOnApi(r.rowInfo.data, true);
                        return r.result;
                    }
                    catch (err) {
                        throw defs.catchSaveErrors(err);
                    }
                }
                else {
                    let defs = getControllerRef(self, undefined);
                    try {
                        await defs.__validateEntity();
                        let r = await new (class extends Action {
                            execute;
                        })(x.classes.get(self.constructor).key +
                            '/' +
                            (options?.apiPrefix ? options.apiPrefix + '/' : '') +
                            key, options?.queue ?? false, options.allowed).run({
                            args,
                            fields: await defs.toApiJson(),
                        }, baseUrl, http);
                        await defs._updateEntityBasedOnApi(r.fields);
                        return r.result;
                    }
                    catch (e) {
                        throw defs.catchSaveErrors(e);
                    }
                }
            },
        };
        result = async function (...args) {
            //@ts-ignore I specifically referred to the this of the original function - so it'll be sent inside
            let self = this;
            if (!isBackend()) {
                return serverAction.doWork(args, self);
            }
            else
                return await originalMethod.apply(self, args);
        };
        registerAction(target.constructor, result);
        result[serverActionField] = serverAction;
        if (descriptor) {
            descriptor.value = result;
            return descriptor;
        }
        else
            return result;
    };
}
const customUndefined = {
    _isUndefined: true,
};
function registerAction(target, resultMethod) {
    ;
    (target[classBackendMethodsArray] || (target[classBackendMethodsArray] = [])).push(resultMethod);
    remultStatic.actionInfo.allActions.push(resultMethod);
}
function isCustomUndefined(x) {
    return x && x._isUndefined;
}
export class ProgressListener {
    res;
    constructor(res) {
        this.res = res;
    }
    progress(progress) {
        this.res.progress(progress);
    }
}
export function prepareArgsToSend(types, args) {
    if (types) {
        for (let index = 0; index < types.length; index++) {
            const paramType = types[index];
            for (const type of [Remult, SqlDatabase]) {
                if (args[index] instanceof type)
                    args[index] = undefined;
                else if (paramType == type) {
                    args[index] = undefined;
                }
            }
            if (args[index] != undefined) {
                let x = { valueType: paramType };
                x = decorateColumnSettings(x, new Remult());
                let eo = getEntitySettings(paramType, false);
                if (eo != null) {
                    let rh = getEntityRef(args[index]);
                    args[index] = rh.getId();
                }
                if (x.valueConverter)
                    args[index] = x.valueConverter.toJson(args[index]);
            }
        }
    }
    return args.map((x) => (x !== undefined ? x : customUndefined));
}
export async function prepareReceivedArgs(types, args, remult, ds, res) {
    for (let index = 0; index < args.length; index++) {
        const element = args[index];
        if (isCustomUndefined(element))
            args[index] = undefined;
    }
    if (types)
        for (let i = 0; i < types.length; i++) {
            if (args.length < i) {
                args.push(undefined);
            }
            if (types[i] == Remult || types[i] == Remult) {
                args[i] = remult;
            }
            else if (types[i] == SqlDatabase && ds) {
                args[i] = ds;
            }
            else if (types[i] == ProgressListener) {
                args[i] = new ProgressListener(res);
            }
            else {
                let x = { valueType: types[i] };
                x = decorateColumnSettings(x, remult);
                if (x.valueConverter)
                    args[i] = x.valueConverter.fromJson(args[i]);
                let eo = getEntitySettings(types[i], false);
                if (eo != null) {
                    if (!(args[i] === null || args[i] === undefined))
                        args[i] = await remult.repo(types[i]).findId(args[i]);
                }
            }
        }
    return args;
}
export const classBackendMethodsArray = Symbol.for('classBackendMethodsArray');
//
async function decideTransaction(remult, options, what) {
    if (options.transactional === undefined || options.transactional === true)
        return await doTransaction(remult, what);
    else
        await what(remult.dataProvider);
}

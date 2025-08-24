"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.classBackendMethodsArray = exports.ProgressListener = exports.myServerAction = exports.ForbiddenError = exports.Action = void 0;
exports.Controller = Controller;
exports.BackendMethod = BackendMethod;
exports.prepareArgsToSend = prepareArgsToSend;
exports.prepareReceivedArgs = prepareReceivedArgs;
var tslib_1 = require("tslib");
require("reflect-metadata");
var buildRestDataProvider_js_1 = require("./buildRestDataProvider.js");
var context_js_1 = require("./context.js");
var sql_database_js_1 = require("./data-providers/sql-database.js");
var remult_proxy_js_1 = require("./remult-proxy.js");
var RepositoryImplementation_js_1 = require("./remult3/RepositoryImplementation.js");
var getEntityRef_js_1 = require("./remult3/getEntityRef.js");
var server_action_info_js_1 = require("./server-action-info.js");
var Fields_js_1 = require("./remult3/Fields.js");
var remult_static_js_1 = require("./remult-static.js");
var Action = /** @class */ (function () {
    function Action(actionUrl, queue, allowed) {
        this.actionUrl = actionUrl;
        this.queue = queue;
        this.allowed = allowed;
    }
    Action.prototype.run = function (pIn, baseUrl, http) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var r, p, progress_1, runningJob_1;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (baseUrl === undefined)
                            baseUrl = remult_proxy_js_1.remult.apiClient.url;
                        if (!http)
                            http = (0, buildRestDataProvider_js_1.buildRestDataProvider)(remult_proxy_js_1.remult.apiClient.httpClient);
                        return [4 /*yield*/, http.post(baseUrl + '/' + this.actionUrl, pIn)];
                    case 1:
                        r = _a.sent();
                        p = r;
                        if (!(p && p.queuedJobId)) return [3 /*break*/, 6];
                        progress_1 = remult_static_js_1.remultStatic.actionInfo.startBusyWithProgress();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, , 4, 5]);
                        return [4 /*yield*/, remult_static_js_1.remultStatic.actionInfo.runActionWithoutBlockingUI(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                return tslib_1.__generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (!(!runningJob_1 || !runningJob_1.done)) return [3 /*break*/, 4];
                                            if (!runningJob_1) return [3 /*break*/, 2];
                                            return [4 /*yield*/, new Promise(function (res) {
                                                    return setTimeout(function () {
                                                        res(undefined);
                                                    }, 200);
                                                })];
                                        case 1:
                                            _a.sent();
                                            _a.label = 2;
                                        case 2: return [4 /*yield*/, http.post(baseUrl + '/' + Action.apiUrlForJobStatus, { queuedJobId: r.queuedJobId })];
                                        case 3:
                                            runningJob_1 = _a.sent();
                                            if (runningJob_1.progress) {
                                                progress_1.progress(runningJob_1.progress);
                                            }
                                            return [3 /*break*/, 0];
                                        case 4: return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 3:
                        _a.sent();
                        if (runningJob_1.error)
                            throw runningJob_1.error;
                        progress_1.progress(1);
                        return [2 /*return*/, runningJob_1.result];
                    case 4:
                        progress_1.close();
                        return [7 /*endfinally*/];
                    case 5: return [3 /*break*/, 7];
                    case 6: return [2 /*return*/, r];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    Action.prototype.__register = function (reg) {
        var _this = this;
        reg(this.actionUrl, this.queue, this.allowed, function (d, req, res) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var r, err_1;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.execute(d, req, res)];
                    case 1:
                        r = _a.sent();
                        res.success(r);
                        return [3 /*break*/, 3];
                    case 2:
                        err_1 = _a.sent();
                        if (err_1.isForbiddenError)
                            // got a problem in next with instance of ForbiddenError  - so replaced it with this bool
                            res.forbidden();
                        else
                            res.error(err_1, undefined);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    Action.apiUrlForJobStatus = 'jobStatusInQueue';
    return Action;
}());
exports.Action = Action;
var ForbiddenError = /** @class */ (function (_super) {
    tslib_1.__extends(ForbiddenError, _super);
    function ForbiddenError(message) {
        if (message === void 0) { message = 'Forbidden'; }
        var _this = _super.call(this, message) || this;
        _this.isForbiddenError = true;
        return _this;
    }
    return ForbiddenError;
}(Error));
exports.ForbiddenError = ForbiddenError;
var myServerAction = /** @class */ (function (_super) {
    tslib_1.__extends(myServerAction, _super);
    function myServerAction(name, types, options, originalMethod) {
        var _a;
        var _this = _super.call(this, name, (_a = options.queue) !== null && _a !== void 0 ? _a : false, options.allowed) || this;
        _this.types = types;
        _this.options = options;
        _this.originalMethod = originalMethod;
        return _this;
    }
    myServerAction.prototype.execute = function (info, remult, res) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var result, ds;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        result = { data: {} };
                        ds = remult.dataProvider;
                        return [4 /*yield*/, decideTransaction(remult, this.options, function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                var _a, _b, err_2;
                                return tslib_1.__generator(this, function (_c) {
                                    switch (_c.label) {
                                        case 0:
                                            if (!remult.isAllowedForInstance(undefined, this.options.allowed))
                                                throw new ForbiddenError();
                                            _a = info;
                                            return [4 /*yield*/, prepareReceivedArgs(this.types(), info.args, remult, ds, res)];
                                        case 1:
                                            _a.args = _c.sent();
                                            _c.label = 2;
                                        case 2:
                                            _c.trys.push([2, 4, , 5]);
                                            _b = result;
                                            return [4 /*yield*/, this.originalMethod(info.args)];
                                        case 3:
                                            _b.data = _c.sent();
                                            return [3 /*break*/, 5];
                                        case 4:
                                            err_2 = _c.sent();
                                            throw err_2;
                                        case 5: return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    return myServerAction;
}(Action));
exports.myServerAction = myServerAction;
var classOptions = new Map();
function Controller(key) {
    return function (target, context) {
        var r = target;
        classOptions.set(r, { key: key });
        (0, context_js_1.setControllerSettings)(target, { key: key });
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
function BackendMethod(options) {
    var _this = this;
    return function (target, context, descriptor) {
        var key = typeof context === 'string' ? context : context.name.toString();
        var originalMethod = descriptor ? descriptor.value : target;
        var result = originalMethod;
        (0, Fields_js_1.checkTarget)(target);
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
            var serverAction_1 = new myServerAction(((options === null || options === void 0 ? void 0 : options.apiPrefix) ? options.apiPrefix + '/' : '') + key, function () { return getTypes(); }, options, function (args) { return originalMethod.apply(undefined, args); });
            serverAction_1.doWork = function (args, self, url, http) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var _this = this;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            args = prepareArgsToSend(getTypes(), args);
                            if (!(options.blockUser === false)) return [3 /*break*/, 2];
                            return [4 /*yield*/, remult_static_js_1.remultStatic.actionInfo.runActionWithoutBlockingUI(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, serverAction_1.run({ args: args }, url, http)];
                                        case 1: return [2 /*return*/, (_a.sent()).data];
                                    }
                                }); }); })];
                        case 1: return [2 /*return*/, _a.sent()];
                        case 2: return [4 /*yield*/, serverAction_1.run({ args: args }, url, http)];
                        case 3: return [2 /*return*/, (_a.sent()).data];
                    }
                });
            }); };
            result = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return tslib_1.__awaiter(this, void 0, void 0, function () {
                    return tslib_1.__generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!!(0, context_js_1.isBackend)()) return [3 /*break*/, 2];
                                return [4 /*yield*/, serverAction_1.doWork(args, undefined)];
                            case 1: return [2 /*return*/, _a.sent()];
                            case 2: return [4 /*yield*/, originalMethod.apply(
                                //@ts-ignore
                                this, args)];
                            case 3: return [2 /*return*/, _a.sent()];
                        }
                    });
                });
            };
            registerAction(target, result);
            result[server_action_info_js_1.serverActionField] = serverAction_1;
            if (descriptor) {
                descriptor.value = result;
                return descriptor;
            }
            else
                return result;
        }
        var x = remult_static_js_1.remultStatic.classHelpers.get(target.constructor);
        if (!x) {
            x = new context_js_1.ClassHelper();
            remult_static_js_1.remultStatic.classHelpers.set(target.constructor, x);
        }
        var serverAction = {
            __register: function (reg) {
                var e_1, _a;
                var _this = this;
                var _b;
                var c = new context_js_1.Remult();
                var _loop_1 = function (constructor) {
                    var controllerOptions = x.classes.get(constructor);
                    if (!controllerOptions.key) {
                        controllerOptions.key = c.repo(constructor).metadata.key;
                    }
                    reg(controllerOptions.key +
                        '/' +
                        ((options === null || options === void 0 ? void 0 : options.apiPrefix) ? options.apiPrefix + '/' : '') +
                        key, options ? (_b = options.queue) !== null && _b !== void 0 ? _b : false : false, options.allowed, function (d, req, res) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                        var allowed, remult_1, r_1, err_3;
                        var _this = this;
                        return tslib_1.__generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    d.args = d.args.map(function (x) { return (isCustomUndefined(x) ? undefined : x); });
                                    allowed = options.allowed;
                                    _a.label = 1;
                                case 1:
                                    _a.trys.push([1, 3, , 4]);
                                    remult_1 = req;
                                    return [4 /*yield*/, decideTransaction(remult_1, options, function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                            var _a, repo, y, rowInfo, rowHelper, rows, defs, err_4, y, controllerRef, err_5;
                                            var _b, _c, _d;
                                            var _e;
                                            return tslib_1.__generator(this, function (_f) {
                                                switch (_f.label) {
                                                    case 0:
                                                        _a = d;
                                                        return [4 /*yield*/, prepareReceivedArgs(getTypes(), d.args, remult_1, remult_1.dataProvider, res)];
                                                    case 1:
                                                        _a.args = _f.sent();
                                                        if (!remult_static_js_1.remultStatic.allEntities.includes(constructor)) return [3 /*break*/, 13];
                                                        repo = remult_1.repo(constructor);
                                                        y = void 0;
                                                        rowInfo = d.rowInfo;
                                                        if (!rowInfo.isNewRow) return [3 /*break*/, 3];
                                                        y = repo.create();
                                                        rowHelper = repo.getEntityRef(y);
                                                        return [4 /*yield*/, rowHelper._updateEntityBasedOnApi(rowInfo.data)];
                                                    case 2:
                                                        _f.sent();
                                                        return [3 /*break*/, 6];
                                                    case 3: return [4 /*yield*/, repo.find({
                                                            where: tslib_1.__assign(tslib_1.__assign({}, repo.metadata.idMetadata.getIdFilter(rowInfo.id)), { $and: [(_e = repo.metadata.options.apiPrefilter) !== null && _e !== void 0 ? _e : {}] }),
                                                        })];
                                                    case 4:
                                                        rows = _f.sent();
                                                        if (rows.length != 1)
                                                            throw new Error('not found or too many matches');
                                                        y = rows[0];
                                                        return [4 /*yield*/, repo.getEntityRef(y)._updateEntityBasedOnApi(rowInfo.data)];
                                                    case 5:
                                                        _f.sent();
                                                        _f.label = 6;
                                                    case 6:
                                                        if (!remult_1.isAllowedForInstance(y, allowed))
                                                            throw new ForbiddenError();
                                                        defs = (0, getEntityRef_js_1.getEntityRef)(y);
                                                        return [4 /*yield*/, defs.__validateEntity()];
                                                    case 7:
                                                        _f.sent();
                                                        _f.label = 8;
                                                    case 8:
                                                        _f.trys.push([8, 11, , 12]);
                                                        _b = {};
                                                        return [4 /*yield*/, originalMethod.apply(y, d.args)];
                                                    case 9:
                                                        _b.result = _f.sent();
                                                        _c = {};
                                                        return [4 /*yield*/, defs.toApiJson()];
                                                    case 10:
                                                        r_1 = (_b.rowInfo = (_c.data = _f.sent(),
                                                            _c.isNewRow = defs.isNew(),
                                                            _c.wasChanged = defs.wasChanged(),
                                                            _c.id = defs.getOriginalId(),
                                                            _c),
                                                            _b);
                                                        return [3 /*break*/, 12];
                                                    case 11:
                                                        err_4 = _f.sent();
                                                        throw defs.catchSaveErrors(err_4);
                                                    case 12: return [3 /*break*/, 20];
                                                    case 13:
                                                        y = new constructor(remult_1, remult_1.dataProvider);
                                                        controllerRef = (0, RepositoryImplementation_js_1.getControllerRef)(y, remult_1);
                                                        return [4 /*yield*/, controllerRef._updateEntityBasedOnApi(d.fields)];
                                                    case 14:
                                                        _f.sent();
                                                        if (!remult_1.isAllowedForInstance(y, allowed))
                                                            throw new ForbiddenError();
                                                        return [4 /*yield*/, controllerRef.__validateEntity()];
                                                    case 15:
                                                        _f.sent();
                                                        _f.label = 16;
                                                    case 16:
                                                        _f.trys.push([16, 19, , 20]);
                                                        _d = {};
                                                        return [4 /*yield*/, originalMethod.apply(y, d.args)];
                                                    case 17:
                                                        _d.result = _f.sent();
                                                        return [4 /*yield*/, controllerRef.toApiJson()];
                                                    case 18:
                                                        r_1 = (_d.fields = _f.sent(),
                                                            _d);
                                                        return [3 /*break*/, 20];
                                                    case 19:
                                                        err_5 = _f.sent();
                                                        throw controllerRef.catchSaveErrors(err_5);
                                                    case 20: return [2 /*return*/];
                                                }
                                            });
                                        }); })];
                                case 2:
                                    _a.sent();
                                    res.success(r_1);
                                    return [3 /*break*/, 4];
                                case 3:
                                    err_3 = _a.sent();
                                    if (err_3.isForbiddenError)
                                        // got a problem in next with instance of ForbiddenError  - so replaced it with this bool
                                        res.forbidden();
                                    else
                                        res.error(err_3, undefined);
                                    return [3 /*break*/, 4];
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); });
                };
                try {
                    for (var _c = tslib_1.__values(x.classes.keys()), _d = _c.next(); !_d.done; _d = _c.next()) {
                        var constructor = _d.value;
                        _loop_1(constructor);
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            },
            doWork: function (args, self, baseUrl, http) {
                return tslib_1.__awaiter(this, void 0, void 0, function () {
                    var defs, classOptions_1, r, _a, _b, err_6, defs, r, _c, _d, e_2;
                    var _e, _f, _g;
                    var _h, _j;
                    return tslib_1.__generator(this, function (_k) {
                        switch (_k.label) {
                            case 0:
                                args = prepareArgsToSend(getTypes(), args);
                                if (!remult_static_js_1.remultStatic.allEntities.includes(target.constructor)) return [3 /*break*/, 8];
                                defs = (0, getEntityRef_js_1.getEntityRef)(self);
                                return [4 /*yield*/, defs.__validateEntity()];
                            case 1:
                                _k.sent();
                                classOptions_1 = x.classes.get(self.constructor);
                                if (!classOptions_1.key) {
                                    classOptions_1.key = defs.repository.metadata.key + '_methods';
                                }
                                _k.label = 2;
                            case 2:
                                _k.trys.push([2, 6, , 7]);
                                _b = (_a = new (/** @class */ (function (_super) {
                                    tslib_1.__extends(class_1, _super);
                                    function class_1() {
                                        return _super !== null && _super.apply(this, arguments) || this;
                                    }
                                    return class_1;
                                }(Action)))(classOptions_1.key +
                                    '/' +
                                    ((options === null || options === void 0 ? void 0 : options.apiPrefix) ? options.apiPrefix + '/' : '') +
                                    key, (_h = options === null || options === void 0 ? void 0 : options.queue) !== null && _h !== void 0 ? _h : false, options.allowed)).run;
                                _e = {
                                    args: args
                                };
                                _f = {};
                                return [4 /*yield*/, defs.toApiJson()];
                            case 3: return [4 /*yield*/, _b.apply(_a, [(_e.rowInfo = (_f.data = _k.sent(),
                                        _f.isNewRow = defs.isNew(),
                                        _f.wasChanged = defs.wasChanged(),
                                        _f.id = defs.getOriginalId(),
                                        _f),
                                        _e), baseUrl,
                                    http])];
                            case 4:
                                r = _k.sent();
                                return [4 /*yield*/, defs._updateEntityBasedOnApi(r.rowInfo.data, true)];
                            case 5:
                                _k.sent();
                                return [2 /*return*/, r.result];
                            case 6:
                                err_6 = _k.sent();
                                throw defs.catchSaveErrors(err_6);
                            case 7: return [3 /*break*/, 15];
                            case 8:
                                defs = (0, RepositoryImplementation_js_1.getControllerRef)(self, undefined);
                                _k.label = 9;
                            case 9:
                                _k.trys.push([9, 14, , 15]);
                                return [4 /*yield*/, defs.__validateEntity()];
                            case 10:
                                _k.sent();
                                _d = (_c = new (/** @class */ (function (_super) {
                                    tslib_1.__extends(class_2, _super);
                                    function class_2() {
                                        return _super !== null && _super.apply(this, arguments) || this;
                                    }
                                    return class_2;
                                }(Action)))(x.classes.get(self.constructor).key +
                                    '/' +
                                    ((options === null || options === void 0 ? void 0 : options.apiPrefix) ? options.apiPrefix + '/' : '') +
                                    key, (_j = options === null || options === void 0 ? void 0 : options.queue) !== null && _j !== void 0 ? _j : false, options.allowed)).run;
                                _g = {
                                    args: args
                                };
                                return [4 /*yield*/, defs.toApiJson()];
                            case 11: return [4 /*yield*/, _d.apply(_c, [(_g.fields = _k.sent(),
                                        _g), baseUrl,
                                    http])];
                            case 12:
                                r = _k.sent();
                                return [4 /*yield*/, defs._updateEntityBasedOnApi(r.fields)];
                            case 13:
                                _k.sent();
                                return [2 /*return*/, r.result];
                            case 14:
                                e_2 = _k.sent();
                                throw defs.catchSaveErrors(e_2);
                            case 15: return [2 /*return*/];
                        }
                    });
                });
            },
        };
        result = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                var self;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            self = this;
                            if (!!(0, context_js_1.isBackend)()) return [3 /*break*/, 1];
                            return [2 /*return*/, serverAction.doWork(args, self)];
                        case 1: return [4 /*yield*/, originalMethod.apply(self, args)];
                        case 2: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        registerAction(target.constructor, result);
        result[server_action_info_js_1.serverActionField] = serverAction;
        if (descriptor) {
            descriptor.value = result;
            return descriptor;
        }
        else
            return result;
    };
}
var customUndefined = {
    _isUndefined: true,
};
function registerAction(target, resultMethod) {
    ;
    (target[exports.classBackendMethodsArray] || (target[exports.classBackendMethodsArray] = [])).push(resultMethod);
    remult_static_js_1.remultStatic.actionInfo.allActions.push(resultMethod);
}
function isCustomUndefined(x) {
    return x && x._isUndefined;
}
var ProgressListener = /** @class */ (function () {
    function ProgressListener(res) {
        this.res = res;
    }
    ProgressListener.prototype.progress = function (progress) {
        this.res.progress(progress);
    };
    return ProgressListener;
}());
exports.ProgressListener = ProgressListener;
function prepareArgsToSend(types, args) {
    var e_3, _a;
    if (types) {
        for (var index = 0; index < types.length; index++) {
            var paramType = types[index];
            try {
                for (var _b = (e_3 = void 0, tslib_1.__values([context_js_1.Remult, sql_database_js_1.SqlDatabase])), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var type = _c.value;
                    if (args[index] instanceof type)
                        args[index] = undefined;
                    else if (paramType == type) {
                        args[index] = undefined;
                    }
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_3) throw e_3.error; }
            }
            if (args[index] != undefined) {
                var x = { valueType: paramType };
                x = (0, RepositoryImplementation_js_1.decorateColumnSettings)(x, new context_js_1.Remult());
                var eo = (0, getEntityRef_js_1.getEntitySettings)(paramType, false);
                if (eo != null) {
                    var rh = (0, getEntityRef_js_1.getEntityRef)(args[index]);
                    args[index] = rh.getId();
                }
                if (x.valueConverter)
                    args[index] = x.valueConverter.toJson(args[index]);
            }
        }
    }
    return args.map(function (x) { return (x !== undefined ? x : customUndefined); });
}
function prepareReceivedArgs(types, args, remult, ds, res) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var index, element, i, x, eo, _a, _b;
        return tslib_1.__generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    for (index = 0; index < args.length; index++) {
                        element = args[index];
                        if (isCustomUndefined(element))
                            args[index] = undefined;
                    }
                    if (!types) return [3 /*break*/, 7];
                    i = 0;
                    _c.label = 1;
                case 1:
                    if (!(i < types.length)) return [3 /*break*/, 7];
                    if (args.length < i) {
                        args.push(undefined);
                    }
                    if (!(types[i] == context_js_1.Remult || types[i] == context_js_1.Remult)) return [3 /*break*/, 2];
                    args[i] = remult;
                    return [3 /*break*/, 6];
                case 2:
                    if (!(types[i] == sql_database_js_1.SqlDatabase && ds)) return [3 /*break*/, 3];
                    args[i] = ds;
                    return [3 /*break*/, 6];
                case 3:
                    if (!(types[i] == ProgressListener)) return [3 /*break*/, 4];
                    args[i] = new ProgressListener(res);
                    return [3 /*break*/, 6];
                case 4:
                    x = { valueType: types[i] };
                    x = (0, RepositoryImplementation_js_1.decorateColumnSettings)(x, remult);
                    if (x.valueConverter)
                        args[i] = x.valueConverter.fromJson(args[i]);
                    eo = (0, getEntityRef_js_1.getEntitySettings)(types[i], false);
                    if (!(eo != null)) return [3 /*break*/, 6];
                    if (!!(args[i] === null || args[i] === undefined)) return [3 /*break*/, 6];
                    _a = args;
                    _b = i;
                    return [4 /*yield*/, remult.repo(types[i]).findId(args[i])];
                case 5:
                    _a[_b] = _c.sent();
                    _c.label = 6;
                case 6:
                    i++;
                    return [3 /*break*/, 1];
                case 7: return [2 /*return*/, args];
            }
        });
    });
}
exports.classBackendMethodsArray = Symbol.for('classBackendMethodsArray');
//
function decideTransaction(remult, options, what) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(options.transactional === undefined || options.transactional === true)) return [3 /*break*/, 2];
                    return [4 /*yield*/, (0, context_js_1.doTransaction)(remult, what)];
                case 1: return [2 /*return*/, _a.sent()];
                case 2: return [4 /*yield*/, what(remult.dataProvider)];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    });
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.remult = exports.RemultProxy = void 0;
var tslib_1 = require("tslib");
var remult_static_js_1 = require("./remult-static.js");
var repository_internals_js_1 = require("./remult3/repository-internals.js");
/*@internal*/
var RemultProxy = /** @class */ (function () {
    function RemultProxy() {
        var _this = this;
        /* @internal*/
        this.iAmRemultProxy = true;
        this.repoCache = new Map();
        //@ts-ignore
        this.repo = function () {
            var _a;
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var self = remult_static_js_1.remultStatic;
            var entityCache = _this.repoCache.get(args[0]);
            if (!entityCache) {
                _this.repoCache.set(args[0], (entityCache = new Map()));
            }
            var result = entityCache.get(args[1]);
            if (result)
                return result;
            result = (_a = {
                    get fields() {
                        var _a;
                        return (_a = remult_static_js_1.remultStatic.remultFactory()).repo.apply(_a, tslib_1.__spreadArray([], tslib_1.__read(args), false)).metadata.fields;
                    }
                },
                //@ts-ignore
                _a[repository_internals_js_1.getInternalKey] = function () {
                    var _a;
                    return (_a = self.remultFactory()).repo.apply(_a, tslib_1.__spreadArray([], tslib_1.__read(args), false))[repository_internals_js_1.getInternalKey]();
                },
                _a.relations = function (args2) {
                    var _a;
                    return (_a = self
                        .remultFactory())
                        .repo.apply(_a, tslib_1.__spreadArray([], tslib_1.__read(args), false)).relations(args2);
                },
                _a.validate = function (a) {
                    var _a, _b;
                    var b = [];
                    for (var _i = 1; _i < arguments.length; _i++) {
                        b[_i - 1] = arguments[_i];
                    }
                    return (_a = (_b = self
                        .remultFactory())
                        .repo.apply(_b, tslib_1.__spreadArray([], tslib_1.__read(args), false)))
                        .validate.apply(_a, tslib_1.__spreadArray([a], tslib_1.__read(b), false));
                },
                _a.addEventListener = function () {
                    var _a, _b;
                    var args2 = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args2[_i] = arguments[_i];
                    }
                    return (_a = (_b = self
                        .remultFactory())
                        .repo.apply(_b, tslib_1.__spreadArray([], tslib_1.__read(args), false)))
                        .addEventListener.apply(_a, tslib_1.__spreadArray([], tslib_1.__read(args2), false));
                },
                _a.count = function () {
                    var _a, _b;
                    var args2 = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args2[_i] = arguments[_i];
                    }
                    return (_a = (_b = self
                        .remultFactory())
                        .repo.apply(_b, tslib_1.__spreadArray([], tslib_1.__read(args), false)))
                        .count.apply(_a, tslib_1.__spreadArray([], tslib_1.__read(args2), false));
                },
                _a.create = function () {
                    var _a, _b;
                    var args2 = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args2[_i] = arguments[_i];
                    }
                    return (_a = (_b = self
                        .remultFactory())
                        .repo.apply(_b, tslib_1.__spreadArray([], tslib_1.__read(args), false)))
                        .create.apply(_a, tslib_1.__spreadArray([], tslib_1.__read(args2), false));
                },
                _a.delete = function (args2) {
                    var _a;
                    return (_a = self
                        .remultFactory())
                        .repo.apply(_a, tslib_1.__spreadArray([], tslib_1.__read(args), false)).delete(args2);
                },
                _a.deleteMany = function (args2) {
                    var _a;
                    return (_a = self
                        .remultFactory())
                        .repo.apply(_a, tslib_1.__spreadArray([], tslib_1.__read(args), false)).deleteMany(args2);
                },
                _a.updateMany = function () {
                    var _a, _b;
                    var args2 = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args2[_i] = arguments[_i];
                    }
                    return (_a = (_b = self
                        .remultFactory())
                        .repo.apply(_b, tslib_1.__spreadArray([], tslib_1.__read(args), false)))
                        .updateMany.apply(_a, tslib_1.__spreadArray([], tslib_1.__read(args2), false));
                },
                _a.find = function () {
                    var _a, _b;
                    var args2 = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args2[_i] = arguments[_i];
                    }
                    return (_a = (_b = self
                        .remultFactory())
                        .repo.apply(_b, tslib_1.__spreadArray([], tslib_1.__read(args), false)))
                        .find.apply(_a, tslib_1.__spreadArray([], tslib_1.__read(args2), false));
                },
                _a.groupBy = function () {
                    var _a, _b;
                    var args2 = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args2[_i] = arguments[_i];
                    }
                    return (_a = (_b = self
                        .remultFactory())
                        .repo.apply(_b, tslib_1.__spreadArray([], tslib_1.__read(args), false)))
                        .groupBy.apply(_a, tslib_1.__spreadArray([], tslib_1.__read(args2), false));
                },
                _a.aggregate = function () {
                    var _a, _b;
                    var args2 = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args2[_i] = arguments[_i];
                    }
                    return (_a = (_b = self
                        .remultFactory())
                        .repo.apply(_b, tslib_1.__spreadArray([], tslib_1.__read(args), false)))
                        .aggregate.apply(_a, tslib_1.__spreadArray([], tslib_1.__read(args2), false));
                },
                _a.findFirst = function () {
                    var _a, _b;
                    var args2 = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args2[_i] = arguments[_i];
                    }
                    return (_a = (_b = self
                        .remultFactory())
                        .repo.apply(_b, tslib_1.__spreadArray([], tslib_1.__read(args), false)))
                        .findFirst.apply(_a, tslib_1.__spreadArray([], tslib_1.__read(args2), false));
                },
                _a.findOne = function () {
                    var _a, _b;
                    var args2 = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args2[_i] = arguments[_i];
                    }
                    return (_a = (_b = self
                        .remultFactory())
                        .repo.apply(_b, tslib_1.__spreadArray([], tslib_1.__read(args), false)))
                        .findOne.apply(_a, tslib_1.__spreadArray([], tslib_1.__read(args2), false));
                },
                _a.findId = function (a, b) {
                    var _a;
                    return (_a = self
                        .remultFactory())
                        .repo.apply(_a, tslib_1.__spreadArray([], tslib_1.__read(args), false)).findId(a, b);
                },
                //@ts-ignore
                _a.toJson = function (json) {
                    var _a;
                    return (_a = self
                        .remultFactory())
                        .repo.apply(_a, tslib_1.__spreadArray([], tslib_1.__read(args), false)).toJson(json);
                },
                _a.fromJson = function (item, isNew) {
                    var _a;
                    return (_a = self
                        .remultFactory())
                        .repo.apply(_a, tslib_1.__spreadArray([], tslib_1.__read(args), false)).fromJson(item, isNew);
                },
                _a.getEntityRef = function () {
                    var _a, _b;
                    var args2 = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args2[_i] = arguments[_i];
                    }
                    return (_a = (_b = self
                        .remultFactory())
                        .repo.apply(_b, tslib_1.__spreadArray([], tslib_1.__read(args), false)))
                        .getEntityRef.apply(_a, tslib_1.__spreadArray([], tslib_1.__read(args2), false));
                },
                _a.insert = function (args2) {
                    var _a;
                    return (_a = self
                        .remultFactory())
                        .repo.apply(_a, tslib_1.__spreadArray([], tslib_1.__read(args), false)).insert(args2);
                },
                _a.liveQuery = function () {
                    var _a, _b;
                    var args2 = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args2[_i] = arguments[_i];
                    }
                    return (_a = (_b = self
                        .remultFactory())
                        .repo.apply(_b, tslib_1.__spreadArray([], tslib_1.__read(args), false)))
                        .liveQuery.apply(_a, tslib_1.__spreadArray([], tslib_1.__read(args2), false));
                },
                Object.defineProperty(_a, "metadata", {
                    get: function () {
                        var _a;
                        return (_a = remult_static_js_1.remultStatic.remultFactory()).repo.apply(_a, tslib_1.__spreadArray([], tslib_1.__read(args), false)).metadata;
                    },
                    enumerable: false,
                    configurable: true
                }),
                _a.query = function (options) {
                    var _a;
                    return (_a = self
                        .remultFactory())
                        .repo.apply(_a, tslib_1.__spreadArray([], tslib_1.__read(args), false)).query(options);
                },
                _a.save = function (args2) {
                    var _a;
                    return (_a = self
                        .remultFactory())
                        .repo.apply(_a, tslib_1.__spreadArray([], tslib_1.__read(args), false)).save(args2);
                },
                _a.upsert = function (args2) {
                    var _a;
                    return (_a = self
                        .remultFactory())
                        .repo.apply(_a, tslib_1.__spreadArray([], tslib_1.__read(args), false)).upsert(args2);
                },
                _a.update = function (a, b) {
                    var _a;
                    return (_a = self
                        .remultFactory())
                        .repo.apply(_a, tslib_1.__spreadArray([], tslib_1.__read(args), false)).update(a, b);
                },
                _a);
            entityCache.set(args[1], result);
            return result;
        };
    }
    Object.defineProperty(RemultProxy.prototype, "liveQuerySubscriber", {
        /* @internal*/
        get: function () {
            return remult_static_js_1.remultStatic.remultFactory().liveQuerySubscriber;
        },
        /* @internal*/
        set: function (val) {
            remult_static_js_1.remultStatic.remultFactory().liveQuerySubscriber = val;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RemultProxy.prototype, "liveQueryStorage", {
        /* @internal*/
        get: function () {
            return remult_static_js_1.remultStatic.remultFactory().liveQueryStorage;
        },
        /* @internal*/
        set: function (val) {
            remult_static_js_1.remultStatic.remultFactory().liveQueryStorage = val;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RemultProxy.prototype, "liveQueryPublisher", {
        /* @internal*/
        get: function () {
            return remult_static_js_1.remultStatic.remultFactory().liveQueryPublisher;
        },
        /* @internal*/
        set: function (val) {
            remult_static_js_1.remultStatic.remultFactory().liveQueryPublisher = val;
        },
        enumerable: false,
        configurable: true
    });
    RemultProxy.prototype.subscribeAuth = function (listener) {
        return remult_static_js_1.remultStatic.remultFactory().subscribeAuth(listener);
    };
    RemultProxy.prototype.initUser = function () {
        return remult_static_js_1.remultStatic.remultFactory().initUser();
    };
    RemultProxy.prototype.call = function (backendMethod, self) {
        var _a;
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        return (_a = remult_static_js_1.remultStatic.remultFactory()).call.apply(_a, tslib_1.__spreadArray([backendMethod, self], tslib_1.__read(args), false));
    };
    Object.defineProperty(RemultProxy.prototype, "context", {
        get: function () {
            return remult_static_js_1.remultStatic.remultFactory().context;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RemultProxy.prototype, "dataProvider", {
        get: function () {
            return remult_static_js_1.remultStatic.remultFactory().dataProvider;
        },
        set: function (provider) {
            remult_static_js_1.remultStatic.remultFactory().dataProvider = provider;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RemultProxy.prototype, "repCache", {
        /*@internal*/
        get: function () {
            return remult_static_js_1.remultStatic.remultFactory().repCache;
        },
        enumerable: false,
        configurable: true
    });
    RemultProxy.prototype.authenticated = function () {
        return remult_static_js_1.remultStatic.remultFactory().authenticated();
    };
    RemultProxy.prototype.isAllowed = function (roles) {
        return remult_static_js_1.remultStatic.remultFactory().isAllowed(roles);
    };
    RemultProxy.prototype.isAllowedForInstance = function (instance, allowed) {
        return remult_static_js_1.remultStatic.remultFactory().isAllowedForInstance(instance, allowed);
    };
    RemultProxy.prototype.clearAllCache = function () {
        return remult_static_js_1.remultStatic.remultFactory().clearAllCache();
    };
    RemultProxy.prototype.useFetch = function (args) {
        return remult_static_js_1.remultStatic.remultFactory().useFetch(args);
    };
    Object.defineProperty(RemultProxy.prototype, "user", {
        get: function () {
            return remult_static_js_1.remultStatic.remultFactory().user;
        },
        set: function (info) {
            remult_static_js_1.remultStatic.remultFactory().user = info;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RemultProxy.prototype, "apiClient", {
        get: function () {
            return remult_static_js_1.remultStatic.remultFactory().apiClient;
        },
        set: function (client) {
            remult_static_js_1.remultStatic.remultFactory().apiClient = client;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RemultProxy.prototype, "subscriptionServer", {
        get: function () {
            return remult_static_js_1.remultStatic.remultFactory().subscriptionServer;
        },
        set: function (value) {
            remult_static_js_1.remultStatic.remultFactory().subscriptionServer = value;
        },
        enumerable: false,
        configurable: true
    });
    return RemultProxy;
}());
exports.RemultProxy = RemultProxy;
exports.remult = new RemultProxy();

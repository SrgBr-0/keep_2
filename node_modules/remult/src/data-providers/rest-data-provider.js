"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.liveQueryAction = exports.RestDataProviderHttpProviderUsingFetch = exports.RestEntityDataProvider = exports.RestDataProvider = void 0;
exports.buildFullUrl = buildFullUrl;
exports.findOptionsToJson = findOptionsToJson;
exports.findOptionsFromJson = findOptionsFromJson;
exports.addFilterToUrlAndReturnTrueIfSuccessful = addFilterToUrlAndReturnTrueIfSuccessful;
var tslib_1 = require("tslib");
var urlBuilder_js_1 = require("../../urlBuilder.js");
var buildRestDataProvider_js_1 = require("../buildRestDataProvider.js");
var filter_interfaces_js_1 = require("../filter/filter-interfaces.js");
var relationInfoMember_js_1 = require("../remult3/relationInfoMember.js");
var remult_static_js_1 = require("../remult-static.js");
var RestDataProvider = /** @class */ (function () {
    function RestDataProvider(apiProvider, entityRequested) {
        this.apiProvider = apiProvider;
        this.entityRequested = entityRequested;
        this.isProxy = true;
    }
    RestDataProvider.prototype.getEntityDataProvider = function (entity) {
        var _this = this;
        var _a;
        (_a = this.entityRequested) === null || _a === void 0 ? void 0 : _a.call(this, entity);
        return new RestEntityDataProvider(function () {
            var _a;
            return buildFullUrl((_a = _this.apiProvider()) === null || _a === void 0 ? void 0 : _a.url, entity.key);
        }, function () {
            return (0, buildRestDataProvider_js_1.buildRestDataProvider)(_this.apiProvider().httpClient);
        }, entity);
    };
    RestDataProvider.prototype.transaction = function (action) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                throw new Error('Method not implemented.');
            });
        });
    };
    return RestDataProvider;
}());
exports.RestDataProvider = RestDataProvider;
function buildFullUrl(httpClientUrl, entityKey) {
    if (httpClientUrl === undefined || httpClientUrl === null)
        httpClientUrl = '/api';
    return httpClientUrl + '/' + entityKey;
}
//@internal
function findOptionsToJson(options, meta) {
    if (options.include) {
        var newInclude = {};
        for (var key in options.include) {
            if (Object.prototype.hasOwnProperty.call(options.include, key)) {
                var element = options.include[key];
                if (typeof element === 'object') {
                    var rel = (0, relationInfoMember_js_1.getRelationFieldInfo)(meta.fields.find(key));
                    if (rel) {
                        element = findOptionsToJson(element, rel.toRepo.metadata);
                    }
                }
                newInclude[key] = element;
            }
        }
        options = tslib_1.__assign(tslib_1.__assign({}, options), { include: newInclude });
    }
    if (options.where)
        options = tslib_1.__assign(tslib_1.__assign({}, options), { where: filter_interfaces_js_1.Filter.entityFilterToJson(meta, options.where) });
    if (options.load)
        options = tslib_1.__assign(tslib_1.__assign({}, options), { load: options.load(meta.fields).map(function (y) { return y.key; }) });
    return options;
}
//@internal
function findOptionsFromJson(json, meta) {
    var e_1, _a;
    var r = {};
    try {
        for (var _b = tslib_1.__values([
            'limit',
            'page',
            'where',
            'orderBy',
            'include',
        ]), _c = _b.next(); !_c.done; _c = _b.next()) {
            var key = _c.value;
            if (json[key] !== undefined) {
                if (key === 'where') {
                    r[key] = filter_interfaces_js_1.Filter.entityFilterFromJson(meta, json.where);
                }
                else if (key === 'include') {
                    var newInclude = tslib_1.__assign({}, json[key]);
                    for (var key_1 in newInclude) {
                        if (Object.prototype.hasOwnProperty.call(newInclude, key_1)) {
                            var element = newInclude[key_1];
                            if (typeof element === 'object') {
                                var rel = (0, relationInfoMember_js_1.getRelationFieldInfo)(meta.fields.find(key_1));
                                if (rel) {
                                    element = findOptionsFromJson(element, rel.toRepo.metadata);
                                }
                            }
                            newInclude[key_1] = element;
                        }
                    }
                    r[key] = newInclude;
                }
                else
                    r[key] = json[key];
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_1) throw e_1.error; }
    }
    if (json.load) {
        r.load = function (z) { return json.load.map(function (y) { return z.find(y); }); };
    }
    return r;
}
var RestEntityDataProvider = /** @class */ (function () {
    function RestEntityDataProvider(url, http, entity) {
        this.url = url;
        this.http = http;
        this.entity = entity;
    }
    RestEntityDataProvider.prototype.query = function (options, aggregateOptions) {
        var _this = this;
        var r = this.buildFindRequest(options);
        return r
            .run('query', {
            aggregate: this.buildAggregateOptions(aggregateOptions),
        })
            .then(function (_a) {
            var items = _a.items, aggregates = _a.aggregates;
            return ({
                items: items.map(function (x) { return _this.translateFromJson(x); }),
                aggregates: aggregates,
            });
        });
    };
    RestEntityDataProvider.prototype.groupBy = function (options) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var run, body, result;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        run = this.buildFindRequest({
                            where: options === null || options === void 0 ? void 0 : options.where,
                            limit: options === null || options === void 0 ? void 0 : options.limit,
                            page: options === null || options === void 0 ? void 0 : options.page,
                        }).run;
                        body = this.buildAggregateOptions(options);
                        return [4 /*yield*/, run('groupBy', Object.keys(body).length > 0 ? body : undefined)];
                    case 1:
                        result = _a.sent();
                        if (options === null || options === void 0 ? void 0 : options.group)
                            result.forEach(function (row) {
                                var e_2, _a;
                                try {
                                    for (var _b = tslib_1.__values(options.group), _c = _b.next(); !_c.done; _c = _b.next()) {
                                        var g = _c.value;
                                        row[g.key] = g.valueConverter.fromJson(row[g.key]);
                                    }
                                }
                                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                                finally {
                                    try {
                                        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                                    }
                                    finally { if (e_2) throw e_2.error; }
                                }
                            });
                        return [2 /*return*/, result];
                }
            });
        });
    };
    RestEntityDataProvider.prototype.buildAggregateOptions = function (options) {
        var _a, _b, _c, _d, _e, _f, _g;
        return {
            groupBy: (_a = options === null || options === void 0 ? void 0 : options.group) === null || _a === void 0 ? void 0 : _a.map(function (x) { return x.key; }),
            sum: (_b = options === null || options === void 0 ? void 0 : options.sum) === null || _b === void 0 ? void 0 : _b.map(function (x) { return x.key; }),
            avg: (_c = options === null || options === void 0 ? void 0 : options.avg) === null || _c === void 0 ? void 0 : _c.map(function (x) { return x.key; }),
            min: (_d = options === null || options === void 0 ? void 0 : options.min) === null || _d === void 0 ? void 0 : _d.map(function (x) { return x.key; }),
            max: (_e = options === null || options === void 0 ? void 0 : options.max) === null || _e === void 0 ? void 0 : _e.map(function (x) { return x.key; }),
            distinctCount: (_f = options === null || options === void 0 ? void 0 : options.distinctCount) === null || _f === void 0 ? void 0 : _f.map(function (x) { return x.key; }),
            orderBy: (_g = options === null || options === void 0 ? void 0 : options.orderBy) === null || _g === void 0 ? void 0 : _g.map(function (x) { var _a; return (tslib_1.__assign(tslib_1.__assign({}, x), { field: (_a = x.field) === null || _a === void 0 ? void 0 : _a.key })); }),
        };
    };
    RestEntityDataProvider.prototype.translateFromJson = function (row) {
        var e_3, _a;
        var result = {};
        try {
            for (var _b = tslib_1.__values(this.entity.fields), _c = _b.next(); !_c.done; _c = _b.next()) {
                var col = _c.value;
                result[col.key] = col.valueConverter.fromJson(row[col.key]);
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_3) throw e_3.error; }
        }
        return result;
    };
    RestEntityDataProvider.prototype.translateToJson = function (row) {
        var e_4, _a;
        var result = {};
        try {
            for (var _b = tslib_1.__values(this.entity.fields), _c = _b.next(); !_c.done; _c = _b.next()) {
                var col = _c.value;
                result[col.key] = col.valueConverter.toJson(row[col.key]);
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_4) throw e_4.error; }
        }
        return result;
    };
    RestEntityDataProvider.prototype.count = function (where) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var run;
            return tslib_1.__generator(this, function (_a) {
                run = this.buildFindRequest({ where: where }).run;
                return [2 /*return*/, run('count').then(function (r) { return +r.count; })];
            });
        });
    };
    RestEntityDataProvider.prototype.deleteMany = function (where) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var run;
            return tslib_1.__generator(this, function (_a) {
                run = this.buildFindRequest({ where: where }, 'delete').run;
                return [2 /*return*/, run('deleteMany').then(function (r) { return +r.deleted; })];
            });
        });
    };
    RestEntityDataProvider.prototype.updateMany = function (where, data) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var run;
            return tslib_1.__generator(this, function (_a) {
                run = this.buildFindRequest({ where: where }, 'put').run;
                return [2 /*return*/, run('updateMany', this.toJsonOfIncludedKeys(data)).then(function (r) { return +r.updated; })];
            });
        });
    };
    RestEntityDataProvider.prototype.upsertMany = function (options) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var run;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                run = this.buildFindRequest(undefined).run;
                return [2 /*return*/, run('upsertMany', options.map(function (x) { return ({
                        where: _this.toJsonOfIncludedKeys(x.where),
                        set: x.set !== undefined ? _this.toJsonOfIncludedKeys(x.set) : undefined,
                    }); })).then(function (r) { return r.map(function (x) { return _this.translateFromJson(x); }); })];
            });
        });
    };
    RestEntityDataProvider.prototype.find = function (options) {
        var _this = this;
        var run = this.buildFindRequest(options).run;
        return run().then(function (x) { return x.map(function (y) { return _this.translateFromJson(y); }); });
    };
    //@internal
    RestEntityDataProvider.prototype.buildFindRequest = function (options, method) {
        var _this = this;
        if (!method)
            method = 'get';
        var url = new urlBuilder_js_1.UrlBuilder(this.url());
        var filterObject;
        if (options) {
            if (options.where) {
                filterObject = options.where.toJson(); //        options.where.__applyToConsumer(new FilterConsumnerBridgeToUrlBuilder(url));
                if (addFilterToUrlAndReturnTrueIfSuccessful(filterObject, url))
                    filterObject = undefined;
            }
            if (options.orderBy && options.orderBy.Segments) {
                var sort_1 = '';
                var order_1 = '';
                var hasDescending_1 = false;
                options.orderBy.Segments.forEach(function (c) {
                    if (sort_1.length > 0) {
                        sort_1 += ',';
                        order_1 += ',';
                    }
                    sort_1 += c.field.key;
                    order_1 += c.isDescending ? 'desc' : 'asc';
                    if (c.isDescending)
                        hasDescending_1 = true;
                });
                if (sort_1)
                    url.add('_sort', sort_1);
                if (hasDescending_1)
                    url.add('_order', order_1);
            }
            if (options.limit)
                url.add('_limit', options.limit);
            if (options.page)
                url.add('_page', options.page);
        }
        var run = function (action, body) {
            var u = new urlBuilder_js_1.UrlBuilder(url.url);
            if (!action && filterObject) {
                action = 'get';
            }
            if (action)
                u.add('__action', action);
            if (filterObject) {
                if (method === 'put') {
                    return _this.http().post(u.url, { set: body, where: filterObject });
                }
                else
                    body = tslib_1.__assign(tslib_1.__assign({}, body), { where: filterObject });
            }
            if (body && method != 'put')
                return _this.http().post(u.url, body);
            else
                return _this.http()[method](u.url, body);
        };
        return {
            createKey: function () { return JSON.stringify({ url: url, filterObject: filterObject }); },
            run: run,
            subscribe: function (queryId) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var result;
                var _this = this;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, run(exports.liveQueryAction + queryId)];
                        case 1:
                            result = _a.sent();
                            return [2 /*return*/, {
                                    result: result,
                                    unsubscribe: function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                        var _this = this;
                                        return tslib_1.__generator(this, function (_a) {
                                            return [2 /*return*/, remult_static_js_1.remultStatic.actionInfo.runActionWithoutBlockingUI(function () {
                                                    return _this.http().post(_this.url() + '?__action=endLiveQuery', {
                                                        id: queryId,
                                                    });
                                                })];
                                        });
                                    }); },
                                }];
                    }
                });
            }); },
        };
    };
    RestEntityDataProvider.prototype.update = function (id, data) {
        var _this = this;
        return this.http()
            .put(this.url() +
            (id != '' ? '/' + encodeURIComponent(id) : '?__action=emptyId'), this.toJsonOfIncludedKeys(data))
            .then(function (y) { return _this.translateFromJson(y); });
    };
    RestEntityDataProvider.prototype.toJsonOfIncludedKeys = function (data) {
        var e_5, _a;
        var result = {};
        var keys = Object.keys(data);
        try {
            for (var _b = tslib_1.__values(this.entity.fields), _c = _b.next(); !_c.done; _c = _b.next()) {
                var col = _c.value;
                if (keys.includes(col.key))
                    result[col.key] = col.valueConverter.toJson(data[col.key]);
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_5) throw e_5.error; }
        }
        return result;
    };
    RestEntityDataProvider.prototype.delete = function (id) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(id == '')) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.deleteMany(filter_interfaces_js_1.Filter.fromEntityFilter(this.entity, this.entity.idMetadata.getIdFilter(id)))];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2: return [2 /*return*/, this.http().delete(this.url() + '/' + encodeURIComponent(id))];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    RestEntityDataProvider.prototype.insert = function (data) {
        var _this = this;
        return this.http()
            .post(this.url(), this.translateToJson(data))
            .then(function (y) { return _this.translateFromJson(y); });
    };
    RestEntityDataProvider.prototype.insertMany = function (data) {
        var _this = this;
        return this.http()
            .post(this.url(), data.map(function (data) { return _this.translateToJson(data); }))
            .then(function (y) { return y.map(function (y) { return _this.translateFromJson(y); }); });
    };
    return RestEntityDataProvider;
}());
exports.RestEntityDataProvider = RestEntityDataProvider;
var RestDataProviderHttpProviderUsingFetch = /** @class */ (function () {
    function RestDataProviderHttpProviderUsingFetch(fetch) {
        this.fetch = fetch;
    }
    RestDataProviderHttpProviderUsingFetch.prototype.get = function (url) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, buildRestDataProvider_js_1.retry)(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                            return tslib_1.__generator(this, function (_a) {
                                return [2 /*return*/, this.myFetch(url).then(function (r) {
                                        return r;
                                    })];
                            });
                        }); })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    RestDataProviderHttpProviderUsingFetch.prototype.put = function (url, data) {
        return this.myFetch(url, {
            method: 'put',
            body: JSON.stringify(data),
        });
    };
    RestDataProviderHttpProviderUsingFetch.prototype.delete = function (url) {
        return this.myFetch(url, { method: 'delete' });
    };
    RestDataProviderHttpProviderUsingFetch.prototype.post = function (url, data) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, buildRestDataProvider_js_1.retry)(function () {
                            return _this.myFetch(url, {
                                method: 'post',
                                body: JSON.stringify(data),
                            });
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    RestDataProviderHttpProviderUsingFetch.prototype.myFetch = function (url, options) {
        var e_6, _a;
        var _this = this;
        var headers = {};
        if (options === null || options === void 0 ? void 0 : options.body)
            headers['Content-type'] = 'application/json';
        if (typeof window !== 'undefined' &&
            typeof window.document !== 'undefined' &&
            typeof (window.document.cookie !== 'undefined'))
            try {
                for (var _b = tslib_1.__values(window.document.cookie.split(';')), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var cookie = _c.value;
                    if (cookie.trim().startsWith('XSRF-TOKEN=')) {
                        headers['X-XSRF-TOKEN'] = cookie.split('=')[1];
                    }
                }
            }
            catch (e_6_1) { e_6 = { error: e_6_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_6) throw e_6.error; }
            }
        return (this.fetch || fetch)(url, {
            credentials: 'include',
            method: options === null || options === void 0 ? void 0 : options.method,
            body: options === null || options === void 0 ? void 0 : options.body,
            headers: headers,
        })
            .then(function (response) {
            return onSuccess(response);
        })
            .catch(function (error) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var r;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, error];
                    case 1:
                        r = _a.sent();
                        throw r;
                }
            });
        }); });
    };
    return RestDataProviderHttpProviderUsingFetch;
}());
exports.RestDataProviderHttpProviderUsingFetch = RestDataProviderHttpProviderUsingFetch;
function onSuccess(response) {
    if (response.status == 204)
        return;
    if (response.status >= 200 && response.status < 300)
        return response.json();
    else {
        throw response
            .json()
            .then(function (x) {
            return tslib_1.__assign(tslib_1.__assign({}, x), { message: x.message || response.statusText, url: response.url, status: response.status });
        })
            .catch(function () {
            throw {
                message: response.statusText,
                url: response.url,
                status: response.status,
            };
        });
    }
}
function addFilterToUrlAndReturnTrueIfSuccessful(filter, url) {
    for (var key in filter) {
        if (Object.prototype.hasOwnProperty.call(filter, key)) {
            var element = filter[key];
            if (Array.isArray(element)) {
                if (element.length > 0 && typeof element[0] === 'object')
                    return false;
                if (element.length > 10)
                    return false;
            }
            if (key === 'NOT')
                return false;
        }
    }
    var _loop_1 = function (key) {
        if (Object.prototype.hasOwnProperty.call(filter, key)) {
            var element = filter[key];
            if (Array.isArray(element)) {
                if (key.endsWith('.in'))
                    url.add(key, JSON.stringify(element));
                else
                    element.forEach(function (e) { return url.add(key, e); });
            }
            else if (key.startsWith(filter_interfaces_js_1.customUrlToken))
                url.add(key, JSON.stringify(element));
            else
                url.add(key, element);
        }
    };
    for (var key in filter) {
        _loop_1(key);
    }
    return true;
}
exports.liveQueryAction = 'liveQuery-';

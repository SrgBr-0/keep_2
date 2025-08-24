"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryResultImpl = void 0;
var tslib_1 = require("tslib");
var context_js_1 = require("../context.js");
var isOfType_js_1 = require("../isOfType.js");
var sort_js_1 = require("../sort.js");
var relation_loader_js_1 = require("./relation-loader.js");
var QueryResultImpl = /** @class */ (function () {
    function QueryResultImpl(options, repo) {
        this.options = options;
        this.repo = repo;
        this._count = undefined;
        if (!this.options)
            this.options = {};
        if (!this.options.pageSize) {
            this.options.pageSize = context_js_1.queryConfig.defaultPageSize;
        }
    }
    QueryResultImpl.prototype.getPage = function (page) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                if ((page !== null && page !== void 0 ? page : 0) < 1)
                    page = 1;
                return [2 /*return*/, this.repo.find({
                        where: this.options.where,
                        orderBy: this.options.orderBy,
                        limit: this.options.pageSize,
                        page: page,
                        load: this.options.load,
                        include: this.options.include,
                    })];
            });
        });
    };
    QueryResultImpl.prototype.count = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(this._count === undefined)) return [3 /*break*/, 2];
                        _a = this;
                        return [4 /*yield*/, this.repo.count(this.options.where)];
                    case 1:
                        _a._count = _b.sent();
                        _b.label = 2;
                    case 2: return [2 /*return*/, this._count];
                }
            });
        });
    };
    QueryResultImpl.prototype.forEach = function (what) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var i, _a, _b, _c, x, e_1_1;
            var _d, e_1, _e, _f;
            return tslib_1.__generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        i = 0;
                        _g.label = 1;
                    case 1:
                        _g.trys.push([1, 7, 8, 13]);
                        _a = true, _b = tslib_1.__asyncValues(this);
                        _g.label = 2;
                    case 2: return [4 /*yield*/, _b.next()];
                    case 3:
                        if (!(_c = _g.sent(), _d = _c.done, !_d)) return [3 /*break*/, 6];
                        _f = _c.value;
                        _a = false;
                        x = _f;
                        return [4 /*yield*/, what(x)];
                    case 4:
                        _g.sent();
                        i++;
                        _g.label = 5;
                    case 5:
                        _a = true;
                        return [3 /*break*/, 2];
                    case 6: return [3 /*break*/, 13];
                    case 7:
                        e_1_1 = _g.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 13];
                    case 8:
                        _g.trys.push([8, , 11, 12]);
                        if (!(!_a && !_d && (_e = _b.return))) return [3 /*break*/, 10];
                        return [4 /*yield*/, _e.call(_b)];
                    case 9:
                        _g.sent();
                        _g.label = 10;
                    case 10: return [3 /*break*/, 12];
                    case 11:
                        if (e_1) throw e_1.error;
                        return [7 /*endfinally*/];
                    case 12: return [7 /*endfinally*/];
                    case 13: return [2 /*return*/, i];
                }
            });
        });
    };
    QueryResultImpl.prototype.paginator = function (pNextPageFilter) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var options, getItems, agg_1, itemsPromise_1, loader_1, items, nextPage, hasNextPage, nextPageFilter_1;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.options.orderBy = sort_js_1.Sort.createUniqueEntityOrderBy(this.repo.metadata, this.options.orderBy);
                        options = {
                            where: {
                                $and: [this.options.where, pNextPageFilter],
                            },
                            orderBy: this.options.orderBy,
                            limit: this.options.pageSize,
                            load: this.options.load,
                            include: this.options.include,
                        };
                        getItems = function () { return _this.repo.find(options); };
                        if (this._aggregates === undefined &&
                            (0, isOfType_js_1.isOfType)(this.options, 'aggregate')) {
                            agg_1 = this.options.aggregate;
                            if (!this.repo._dataProvider.isProxy) {
                                itemsPromise_1 = getItems();
                                getItems = function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                    var _a;
                                    return tslib_1.__generator(this, function (_b) {
                                        switch (_b.label) {
                                            case 0:
                                                _a = this;
                                                return [4 /*yield*/, this.repo.aggregate(tslib_1.__assign(tslib_1.__assign({}, agg_1), { where: this.options.where }))];
                                            case 1:
                                                _a._aggregates = _b.sent();
                                                this._count = this._aggregates.$count;
                                                return [2 /*return*/, itemsPromise_1];
                                        }
                                    });
                                }); };
                            }
                            else {
                                loader_1 = new relation_loader_js_1.RelationLoader();
                                getItems = function () {
                                    return _this.repo
                                        ._rawFind(options, false, loader_1, function (opt) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                        var r, _a, _b, _c;
                                        return tslib_1.__generator(this, function (_d) {
                                            switch (_d.label) {
                                                case 0:
                                                    _b = (_a = this.repo._edp).query;
                                                    _c = [opt];
                                                    return [4 /*yield*/, this.repo.__buildGroupByOptions(agg_1)];
                                                case 1: return [4 /*yield*/, _b.apply(_a, _c.concat([_d.sent()]))];
                                                case 2:
                                                    r = _d.sent();
                                                    this._aggregates = r.aggregates;
                                                    return [2 /*return*/, r.items];
                                            }
                                        });
                                    }); })
                                        .then(function (y) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                        return tslib_1.__generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0: return [4 /*yield*/, loader_1.resolveAll()];
                                                case 1:
                                                    _a.sent();
                                                    return [2 /*return*/, y];
                                            }
                                        });
                                    }); });
                                };
                            }
                        }
                        return [4 /*yield*/, getItems()];
                    case 1:
                        items = _a.sent();
                        nextPage = function () {
                            throw new Error('no more pages');
                        };
                        hasNextPage = items.length == this.options.pageSize;
                        if (!hasNextPage) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.repo._createAfterFilter(this.options.orderBy, items[items.length - 1])];
                    case 2:
                        nextPageFilter_1 = _a.sent();
                        nextPage = function () { return _this.paginator(nextPageFilter_1); };
                        _a.label = 3;
                    case 3: return [2 /*return*/, {
                            count: function () { return _this.count(); },
                            hasNextPage: hasNextPage,
                            items: items,
                            nextPage: nextPage,
                            //@ts-ignore
                            aggregates: this._aggregates,
                        }];
                }
            });
        });
    };
    QueryResultImpl.prototype[Symbol.asyncIterator] = function () {
        var _this = this;
        if (!this.options.where) {
            this.options.where = {};
        }
        var ob = this.options.orderBy;
        this.options.orderBy = sort_js_1.Sort.createUniqueEntityOrderBy(this.repo.metadata, ob);
        var itemIndex = -1;
        var currentPage = undefined;
        var itStrategy;
        var j = 0;
        itStrategy = function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, prev;
            var _d;
            return tslib_1.__generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        if (!this.options.progress) return [3 /*break*/, 2];
                        _b = (_a = this.options.progress).progress;
                        _c = j++;
                        return [4 /*yield*/, this.count()];
                    case 1:
                        _b.apply(_a, [_c / (_e.sent())]);
                        _e.label = 2;
                    case 2:
                        if (!(currentPage === undefined || itemIndex == currentPage.items.length)) return [3 /*break*/, 7];
                        if (currentPage && !currentPage.hasNextPage)
                            return [2 /*return*/, { value: undefined, done: true }];
                        prev = currentPage;
                        if (!currentPage) return [3 /*break*/, 4];
                        return [4 /*yield*/, currentPage.nextPage()];
                    case 3:
                        currentPage = _e.sent();
                        return [3 /*break*/, 6];
                    case 4: return [4 /*yield*/, this.paginator()];
                    case 5:
                        currentPage = _e.sent();
                        _e.label = 6;
                    case 6:
                        itemIndex = 0;
                        if (currentPage.items.length == 0) {
                            return [2 /*return*/, { value: undefined, done: true }];
                        }
                        else {
                            if ((_d = prev === null || prev === void 0 ? void 0 : prev.items.length) !== null && _d !== void 0 ? _d : 0 > 0) {
                                if (this.repo.getEntityRef(prev.items[0]).getId() ==
                                    this.repo.getEntityRef(currentPage.items[0]).getId())
                                    throw new Error('pagination failure, returned same first row');
                            }
                        }
                        _e.label = 7;
                    case 7:
                        if (itemIndex < currentPage.items.length)
                            return [2 /*return*/, { value: currentPage.items[itemIndex++], done: false }];
                        return [2 /*return*/, { done: true, value: undefined }];
                }
            });
        }); };
        return {
            next: function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var r;
                return tslib_1.__generator(this, function (_a) {
                    r = itStrategy();
                    return [2 /*return*/, r];
                });
            }); },
        };
    };
    return QueryResultImpl;
}());
exports.QueryResultImpl = QueryResultImpl;

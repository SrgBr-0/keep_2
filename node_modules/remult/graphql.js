"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.remultGraphql = remultGraphql;
exports.translateWhereToRestBody = translateWhereToRestBody;
var tslib_1 = require("tslib");
var internals_js_1 = require("./internals.js");
var index_js_1 = require("./index.js");
var data_api_js_1 = require("./src/data-api.js");
var repository_internals_js_1 = require("./src/remult3/repository-internals.js");
var v2ConnectionAndPagination = false;
var andImplementation = false;
var _removeComments = false;
function remultGraphql(options) {
    var e_1, _a, e_2, _b, e_3, _c, e_4, _d, e_5, _e;
    var _this = this;
    if (!options.getRemultFromRequest) {
        options.getRemultFromRequest = function () { return tslib_1.__awaiter(_this, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
            return [2 /*return*/, index_js_1.remult];
        }); }); };
    }
    var removeComments = tslib_1.__assign({ removeComments: false }, options).removeComments;
    if (removeComments) {
        _removeComments = true;
    }
    var entities = (function () {
        var _a;
        var remult = new index_js_1.Remult();
        return ((_a = options.entities) === null || _a === void 0 ? void 0 : _a.map(function (x) { return remult.repo(x).metadata; })) || [];
    })();
    var types = [];
    var root = {};
    var resolversQuery = {};
    var resolversMutation = {};
    var resolvers = { Query: resolversQuery, Mutation: resolversMutation };
    function upsertTypes(key, kind, order) {
        if (kind === void 0) { kind = 'type'; }
        if (order === void 0) { order = 0; }
        var t = types.find(function (t) { return t.key === key; });
        if (!t) {
            types.push((t = {
                key: key,
                kind: kind,
                fields: [],
                query: {
                    orderBy: [],
                    whereType: [],
                    whereTypeSubFields: [],
                    resultProcessors: [],
                },
                mutation: {
                    create: {},
                    update: {},
                    delete: {},
                },
                order: order,
            }));
            if (kind === 'type_impl_node') {
                t.fields.push(tslib_1.__assign(tslib_1.__assign({}, argNodeId), { order: 111 }));
            }
        }
        return t;
    }
    function upsertUnion(key, values, order) {
        var u = upsertTypes(key, 'union', order);
        u.fields = values.map(function (value) {
            return { key: value, value: { Union: true } };
        });
        return u;
    }
    try {
        // Where - GraphQL primitives
        for (var _f = tslib_1.__values(['String', 'Int', 'Float', 'Boolean', 'ID']), _g = _f.next(); !_g.done; _g = _f.next()) {
            var whereType = _g.value;
            var currentWhere = upsertTypes("Where".concat(whereType), 'input', 20);
            var currentWhereNullable = upsertTypes("Where".concat(whereType, "Nullable"), 'input', 20);
            // For everyone
            var operatorType = ['eq', 'ne'];
            var operatorTypeArray = ['in', 'nin'];
            try {
                for (var _h = (e_2 = void 0, tslib_1.__values(tslib_1.__spreadArray(tslib_1.__spreadArray([], tslib_1.__read(operatorType), false), tslib_1.__read(operatorTypeArray), false))), _j = _h.next(); !_j.done; _j = _h.next()) {
                    var operator = _j.value;
                    var field = {
                        key: operator,
                        value: operatorTypeArray.includes(operator)
                            ? "[".concat(whereType, "!]")
                            : whereType,
                    };
                    currentWhere.fields.push(field);
                    currentWhereNullable.fields.push(field);
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_j && !_j.done && (_b = _h.return)) _b.call(_h);
                }
                finally { if (e_2) throw e_2.error; }
            }
            // only for specific types
            if (whereType === 'String' ||
                whereType === 'Int' ||
                whereType === 'Float') {
                try {
                    for (var _k = (e_3 = void 0, tslib_1.__values(['gt', 'gte', 'lt', 'lte'])), _l = _k.next(); !_l.done; _l = _k.next()) {
                        var operator = _l.value;
                        var field = {
                            key: operator,
                            value: whereType,
                        };
                        currentWhere.fields.push(field);
                        currentWhereNullable.fields.push(field);
                    }
                }
                catch (e_3_1) { e_3 = { error: e_3_1 }; }
                finally {
                    try {
                        if (_l && !_l.done && (_c = _k.return)) _c.call(_k);
                    }
                    finally { if (e_3) throw e_3.error; }
                }
            }
            if (whereType === 'String') {
                try {
                    for (var _m = (e_4 = void 0, tslib_1.__values(['contains', 'notContains'])), _o = _m.next(); !_o.done; _o = _m.next()) {
                        var operator = _o.value;
                        var field = {
                            key: operator,
                            value: whereType,
                        };
                        currentWhere.fields.push(field);
                        currentWhereNullable.fields.push(field);
                    }
                }
                catch (e_4_1) { e_4 = { error: e_4_1 }; }
                finally {
                    try {
                        if (_o && !_o.done && (_d = _m.return)) _d.call(_m);
                    }
                    finally { if (e_4) throw e_4.error; }
                }
            }
            // add only for nullable
            currentWhereNullable.fields.push({
                key: 'null',
                value: 'Boolean',
            });
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_g && !_g.done && (_a = _f.return)) _a.call(_f);
        }
        finally { if (e_1) throw e_1.error; }
    }
    var root_query = upsertTypes('Query', 'type', -10);
    root_query.comment = "Represents all Remult entities.";
    var argId = { key: "id", value: "ID!" };
    var nodeIdKey = 'nodeId';
    var argNodeId = {
        key: nodeIdKey,
        value: "ID!",
        comment: "The globally unique `ID` _(_typename:id)_",
    };
    var argClientMutationId = { key: 'clientMutationId', value: "String" };
    var argErrorDetail = { key: 'error', value: "ErrorDetail" };
    var _loop_1 = function (meta) {
        var e_6, _p;
        var orderByFields = [];
        var key = meta.key;
        var requiredWhereArg = {
            key: 'where',
            value: "".concat(key, "Where!"),
            comment: "Remult filtering options",
        };
        var currentType = upsertTypes(getMetaType(meta), 'type_impl_node');
        if (key) {
            var createResultPromise_1 = function (work) {
                return function (arg1, req) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                    return tslib_1.__generator(this, function (_a) {
                        return [2 /*return*/, new Promise(function (res, error) {
                                var result;
                                var err;
                                var response = {
                                    success: function (x) {
                                        err = 'success not handled';
                                    },
                                    created: function () {
                                        err = 'created not handled';
                                    },
                                    deleted: function () {
                                        err = 'deleted not handled';
                                    },
                                    error: function (x) { return (err = x); },
                                    forbidden: function () { return (err = 'forbidden'); },
                                    notFound: function () { return (err = 'not found'); },
                                    progress: function () { },
                                };
                                work(response, function (x) { return (result = x); }, arg1, req)
                                    .then(function () {
                                    if (err) {
                                        error(err);
                                        return;
                                    }
                                    res(result);
                                })
                                    .catch(function (err) { return error(err); });
                            })];
                    });
                }); };
            };
            var handleRequestWithDataApiContextBasedOnRepo_1 = function (repo, work) {
                return createResultPromise_1(function (response, setResult, arg1, req) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                    var dApi;
                    return tslib_1.__generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                dApi = new data_api_js_1.DataApi(repo, index_js_1.remult);
                                return [4 /*yield*/, work(dApi, response, setResult, arg1, repo.metadata)];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
            };
            var handleRequestWithDataApiContext_1 = function (work) {
                return createResultPromise_1(function (response, setResult, arg1, req) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                    var remult, repo, dApi;
                    return tslib_1.__generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, options.getRemultFromRequest(req)];
                            case 1:
                                remult = _a.sent();
                                repo = remult.repo(meta.entityType);
                                dApi = new data_api_js_1.DataApi(repo, remult);
                                return [4 /*yield*/, work(dApi, response, setResult, arg1, meta)];
                            case 2:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
            };
            var handleMutationWithErrors_1 = function (work) {
                return handleRequestWithDataApiContext_1(function (dApi, response, origSetResult, arg1, req) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                    var setResult;
                    return tslib_1.__generator(this, function (_a) {
                        setResult = function (item) {
                            origSetResult(tslib_1.__assign({ clientMutationId: arg1.clientMutationId }, item));
                        };
                        return [2 /*return*/, work(dApi, tslib_1.__assign(tslib_1.__assign({}, response), { forbidden: function () {
                                    setResult({
                                        error: {
                                            __typename: 'ForbiddenError',
                                            message: 'forbidden',
                                        },
                                    });
                                }, notFound: function () {
                                    setResult({
                                        error: {
                                            __typename: 'NotFoundError',
                                            message: 'not found',
                                        },
                                    });
                                }, error: function (err) {
                                    var modelState = [];
                                    if (err.modelState)
                                        for (var key_1 in err.modelState) {
                                            modelState.push({
                                                field: key_1,
                                                message: err.modelState[key_1],
                                            });
                                        }
                                    setResult({
                                        error: {
                                            __typename: 'ValidationError',
                                            message: err.message,
                                            modelState: modelState,
                                        },
                                    });
                                } }), setResult, arg1, req)];
                    });
                }); });
            };
            var queryArgsConnection = getQueryArgsConnection(key);
            var pluralEntityKey = key;
            var getSingleEntityKey_1 = toCamelCase(getMetaType(meta));
            if (getSingleEntityKey_1 === toCamelCase(key))
                getSingleEntityKey_1 = 'single' + key;
            root_query.fields.push({
                key: getSingleEntityKey_1,
                args: [argId],
                value: "".concat(getMetaType(meta)),
                comment: "Get `".concat(getMetaType(meta), "` entity"),
            });
            root[getSingleEntityKey_1] = handleRequestWithDataApiContext_1(function (dApi, response, setResult, arg1, req) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, dApi.get(tslib_1.__assign(tslib_1.__assign({}, response), { success: function (y) {
                                    var orig = tslib_1.__assign({}, y);
                                    currentType.query.resultProcessors.forEach(function (z) { return z(y, orig); });
                                    setResult(y);
                                } }), arg1.id)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            resolversQuery[getSingleEntityKey_1] = function (origItem, args, req, gqlInfo) { return root[getSingleEntityKey_1](args, req, gqlInfo); };
            // Connection (v1 items, v2 edges)
            var connectionKey = "".concat(getMetaType(meta), "Connection");
            root_query.fields.push({
                key: key,
                args: queryArgsConnection,
                value: connectionKey,
                comment: "List all `".concat(getMetaType(meta), "` entity (with pagination, sorting and filtering)"),
            });
            var connection = upsertTypes(connectionKey, 'type');
            var totalCountKey_1 = 'totalCount';
            connection.fields.push({
                key: totalCountKey_1,
                value: 'Int!',
            });
            if (v2ConnectionAndPagination) {
                connection.fields.push({
                    key: 'edges',
                    value: "[".concat(getMetaType(meta), "Edge!]!"),
                });
            }
            var itemsKey_1 = 'items';
            connection.fields.push({
                key: itemsKey_1,
                value: "[".concat(getMetaType(meta), "!]!"),
            });
            if (v2ConnectionAndPagination) {
                connection.fields.push({
                    key: 'pageInfo',
                    value: "PageInfo!",
                });
            }
            if (v2ConnectionAndPagination) {
                var edge = upsertTypes("".concat(getMetaType(meta), "Edge"), 'type');
                edge.fields.push({
                    key: 'node',
                    value: "".concat(getMetaType(meta), "!"),
                });
                var cursorKey = 'cursor';
                edge.fields.push({
                    key: cursorKey,
                    value: "String!",
                });
            }
            root[key] = handleRequestWithDataApiContext_1(function (dApi, response, setResult, arg1, meta) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    connectionImplementation(setResult, itemsKey_1, createResultPromise_1, dApi, currentType, arg1, meta, totalCountKey_1);
                    return [2 /*return*/];
                });
            }); });
            resolversQuery[key] = function (origItem, args, req, gqlInfo) {
                return root[key](args, req, gqlInfo);
            };
            // Mutation
            var root_mutation = upsertTypes('Mutation', 'type', -9);
            var checkCanExist = function (rule) {
                return rule !== false &&
                    !(rule === undefined &&
                        (meta.options.allowApiCrud === false ||
                            meta.options.allowApiCrud === undefined));
            };
            if (checkCanExist(meta.options.allowApiInsert)) {
                // create
                var createResolverKey_1 = "create".concat(getMetaType(meta));
                var createInput = "Create".concat(getMetaType(meta), "Input");
                var createPayload = "Create".concat(getMetaType(meta), "Payload");
                root_mutation.fields.push({
                    key: createResolverKey_1,
                    args: [
                        { key: 'input', value: "".concat(createInput, "!") },
                        argClientMutationId,
                    ],
                    value: "".concat(createPayload),
                    comment: "Create a new `".concat(getMetaType(meta), "`"),
                });
                currentType.mutation.create.input = upsertTypes(createInput, 'input');
                currentType.mutation.create.payload = upsertTypes(createPayload);
                currentType.mutation.create.payload.fields.push({
                    key: "".concat(toCamelCase(getMetaType(meta))),
                    value: getMetaType(meta),
                }, argErrorDetail, argClientMutationId);
                root[createResolverKey_1] = handleMutationWithErrors_1(function (dApi, response, setResult, arg1, req) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                    return tslib_1.__generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, dApi.httpPost(tslib_1.__assign(tslib_1.__assign({}, response), { created: function (y) {
                                        var _a;
                                        var orig = tslib_1.__assign({}, y);
                                        currentType.query.resultProcessors.forEach(function (z) { return z(y, orig); });
                                        setResult((_a = {},
                                            _a[toCamelCase(getMetaType(meta))] = y,
                                            _a));
                                    } }), { get: function () { return undefined; } }, arg1.input, undefined)];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                resolversMutation[createResolverKey_1] = function (origItem, args, req, gqlInfo) { return root[createResolverKey_1](args, req, gqlInfo); };
            }
            if (checkCanExist(meta.options.allowApiUpdate)) {
                // update
                var updateInput = "Update".concat(getMetaType(meta), "Input");
                {
                    var updatePayload = "Update".concat(getMetaType(meta), "Payload");
                    var updateResolverKey = "update".concat(getMetaType(meta));
                    root_mutation.fields.push({
                        key: updateResolverKey,
                        args: [
                            argId,
                            { key: 'patch', value: "".concat(updateInput, "!") },
                            argClientMutationId,
                        ],
                        value: "".concat(updatePayload),
                        comment: "Update a `".concat(getMetaType(meta), "`"),
                    });
                    currentType.mutation.update.input = upsertTypes(updateInput, 'input');
                    currentType.mutation.update.payload = upsertTypes(updatePayload);
                    currentType.mutation.update.payload.fields.push({
                        key: "".concat(toCamelCase(getMetaType(meta))),
                        value: "".concat(getMetaType(meta)),
                    }, argErrorDetail, argClientMutationId);
                    resolversMutation[updateResolverKey] = function (origItem, args, req, gqlInfo) {
                        return handleMutationWithErrors_1(function (dApi, response, setResult, arg1, req) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                            return tslib_1.__generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, dApi.put(tslib_1.__assign(tslib_1.__assign({}, response), { success: function (y) {
                                                var _a;
                                                var orig = tslib_1.__assign({}, y);
                                                currentType.query.resultProcessors.forEach(function (z) {
                                                    return z(y, orig);
                                                });
                                                setResult((_a = {},
                                                    _a[toCamelCase(getMetaType(meta))] = y,
                                                    _a));
                                            } }), arg1.id, arg1.patch)];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })(args, req);
                    };
                }
                // update many
                {
                    var updateManyPayload = "UpdateMany".concat(upperFirstChar(pluralEntityKey), "Payload");
                    var updateManyResolverKey = "updateMany".concat(upperFirstChar(pluralEntityKey));
                    root_mutation.fields.push({
                        key: updateManyResolverKey,
                        args: [
                            requiredWhereArg,
                            { key: 'patch', value: "".concat(updateInput, "!") },
                            argClientMutationId,
                        ],
                        value: "".concat(updateManyPayload),
                        comment: "Update many `".concat(pluralEntityKey, "`"),
                    });
                    currentType.mutation.update.payload = upsertTypes(updateManyPayload);
                    currentType.mutation.update.payload.fields.push({
                        key: "updated",
                        value: "Int!",
                    }, argErrorDetail, argClientMutationId);
                    resolversMutation[updateManyResolverKey] = function (origItem, args, req, gqlInfo) {
                        return handleMutationWithErrors_1(function (dApi, response, setResult, arg1, req) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                            return tslib_1.__generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, dApi.updateManyImplementation(tslib_1.__assign(tslib_1.__assign({}, response), { success: function (updateManyResult) {
                                                setResult(updateManyResult);
                                            } }), { get: function () { return undefined; } }, tslib_1.__assign(tslib_1.__assign({}, translateWhereToRestBody(meta.fields, arg1)), { set: arg1.patch }))];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })(args, req);
                    };
                }
            }
            if (checkCanExist(meta.options.allowApiDelete)) {
                // delete
                {
                    var deletePayload = "Delete".concat(getMetaType(meta), "Payload");
                    var deleteResolverKey = "delete".concat(getMetaType(meta));
                    root_mutation.fields.push({
                        key: deleteResolverKey,
                        args: [argId, argClientMutationId],
                        value: "".concat(deletePayload),
                        comment: "Delete a `".concat(getMetaType(meta), "`"),
                    });
                    currentType.mutation.delete.payload = upsertTypes(deletePayload);
                    var deletedResultKey_1 = "id";
                    var type = meta.idMetadata.field instanceof index_js_1.CompoundIdField
                        ? 'String'
                        : getGraphqlBaseType(meta.idMetadata.field);
                    currentType.mutation.delete.payload.fields.push({
                        key: deletedResultKey_1,
                        value: "".concat(type),
                    }, argErrorDetail, argClientMutationId);
                    resolversMutation[deleteResolverKey] = function (origItem, args, req) {
                        return handleMutationWithErrors_1(function (dApi, response, setResult, arg1, req) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                            return tslib_1.__generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, dApi.delete(tslib_1.__assign(tslib_1.__assign({}, response), { deleted: function () {
                                                var _a;
                                                setResult((_a = {}, _a[deletedResultKey_1] = arg1.id, _a));
                                            } }), arg1.id)];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })(args, req);
                    };
                }
                // delete
                {
                    var deleteManyPayload = "DeleteMany".concat(upperFirstChar(pluralEntityKey), "Payload");
                    var deleteManyResolverKey = "deleteMany".concat(upperFirstChar(pluralEntityKey));
                    root_mutation.fields.push({
                        key: deleteManyResolverKey,
                        args: [requiredWhereArg, argClientMutationId],
                        value: "".concat(deleteManyPayload),
                        comment: "Delete many `".concat(pluralEntityKey, "`"),
                    });
                    currentType.mutation.delete.payload = upsertTypes(deleteManyPayload);
                    var type = meta.idMetadata.field instanceof index_js_1.CompoundIdField
                        ? 'String'
                        : getGraphqlBaseType(meta.idMetadata.field);
                    currentType.mutation.delete.payload.fields.push({
                        key: 'deleted',
                        value: "Int!",
                    }, argErrorDetail, argClientMutationId);
                    resolversMutation[deleteManyResolverKey] = function (origItem, args, req) {
                        return handleMutationWithErrors_1(function (dApi, response, setResult, arg1, req) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                            return tslib_1.__generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, dApi.deleteMany(tslib_1.__assign(tslib_1.__assign({}, response), { success: function (deleteManyResult) {
                                                setResult(deleteManyResult);
                                            } }), { get: function () { return undefined; } }, translateWhereToRestBody(meta.fields, arg1))];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })(args, req);
                    };
                }
            }
            var whereTypeFields = [];
            var _loop_2 = function (f) {
                var ri = (0, internals_js_1.getRelationFieldInfo)(f);
                if (f.options.includeInApi === false)
                    return "continue";
                var type = getGraphqlBaseType(f);
                currentType.query.resultProcessors.push(function (r) {
                    r[nodeIdKey] = function () {
                        return getMetaType(meta) + ':' + meta.idMetadata.getId(r);
                    };
                });
                var ref = entities.find(function (i) { return i.entityType === f.valueType; });
                var notARealField = false;
                if (ri) {
                    {
                        var refType_1 = ri.toEntity;
                        ref = entities.find(function (i) { return i.entityType === refType_1; });
                    }
                    if (!ref) {
                        throw new Error("Entity \"".concat(ri.toEntity.name, "\" that is used by the relation \"").concat(f.key, "\" in \"").concat(meta.entityType.name, "\" was not found in the 'entities' array."));
                    }
                    notARealField = ri.type === 'toOne' || ri.type === 'toMany';
                    var refKey = ref.key;
                    switch (ri.type) {
                        case 'reference':
                        case 'toOne':
                            currentType.fields.push({
                                key: f.key,
                                value: "".concat(getMetaType(ref)).concat(f.allowNull ? '' : '!'),
                                comment: f.caption,
                            });
                            currentType.query.resultProcessors.push(function (r, orig) {
                                r[f.key] = function (args, req, gqlInfo) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                    var remult, myRepo, item, _a, toRepo, returnNull, returnUndefined, result, resultItems;
                                    var _this = this;
                                    return tslib_1.__generator(this, function (_b) {
                                        switch (_b.label) {
                                            case 0: return [4 /*yield*/, options.getRemultFromRequest(req)];
                                            case 1:
                                                remult = _b.sent();
                                                myRepo = remult.repo(meta.entityType);
                                                item = myRepo.fromJson(orig);
                                                _a = (0, repository_internals_js_1.getRepositoryInternals)(myRepo)._getFocusedRelationRepo(myRepo.fields.find(f), item), toRepo = _a.toRepo, returnNull = _a.returnNull, returnUndefined = _a.returnUndefined;
                                                if (returnNull || returnUndefined)
                                                    return [2 /*return*/, null];
                                                return [4 /*yield*/, handleRequestWithDataApiContextBasedOnRepo_1(toRepo, function (dApi, response, setResult, arg1, meta) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                                        return tslib_1.__generator(this, function (_a) {
                                                            switch (_a.label) {
                                                                case 0: return [4 /*yield*/, connectionImplementation(setResult, itemsKey_1, createResultPromise_1, dApi, upsertTypes(getMetaType(ref)), arg1, meta, totalCountKey_1)];
                                                                case 1: return [2 /*return*/, _a.sent()];
                                                            }
                                                        });
                                                    }); })(tslib_1.__assign(tslib_1.__assign({}, args), { options: { limit: 1 } }), req)];
                                            case 2:
                                                result = _b.sent();
                                                return [4 /*yield*/, result.items()];
                                            case 3:
                                                resultItems = _b.sent();
                                                return [2 /*return*/, resultItems[0]];
                                        }
                                    });
                                }); };
                            });
                            break;
                        case 'toMany':
                            // will do: Category.tasks (actually: Category.tasksOfcategory & tasksOfcategory2)
                            currentType.fields.push({
                                key: f.key,
                                args: getQueryArgsConnection(refKey),
                                value: "".concat(getMetaType(ref), "Connection"),
                                order: 10,
                                comment: "List all `".concat(getMetaType(meta), "` of `").concat(refKey, "`"),
                            });
                            currentType.query.resultProcessors.push(function (r, y) {
                                r[f.key] = function (args, req, gqlInfo) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                    var remult, myRepo, item, relRepo;
                                    var _this = this;
                                    return tslib_1.__generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, options.getRemultFromRequest(req)];
                                            case 1:
                                                remult = _a.sent();
                                                myRepo = remult.repo(meta.entityType);
                                                item = myRepo.fromJson(y);
                                                relRepo = myRepo.relations(item)[f.key];
                                                return [2 /*return*/, handleRequestWithDataApiContextBasedOnRepo_1(relRepo, function (dApi, response, setResult, arg1, meta) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                                        return tslib_1.__generator(this, function (_a) {
                                                            switch (_a.label) {
                                                                case 0: return [4 /*yield*/, connectionImplementation(setResult, itemsKey_1, createResultPromise_1, dApi, upsertTypes(getMetaType(ref)), arg1, meta, totalCountKey_1)];
                                                                case 1: return [2 /*return*/, _a.sent()];
                                                            }
                                                        });
                                                    }); })(args, req)];
                                        }
                                    });
                                }); };
                            });
                    }
                }
                else if (ref !== undefined) {
                    // will do: Task.category
                    currentType.fields.push({
                        key: f.key,
                        value: "".concat(getMetaType(ref)).concat(f.allowNull ? '' : '!'),
                        comment: f.caption,
                    });
                    var refKey_1 = ref.key;
                    currentType.query.resultProcessors.push(function (r) {
                        var val = r[f.key];
                        if (val === null || val === undefined)
                            return null;
                        r[f.key] = function (args, req, gqlInfo) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                            var queryResult;
                            return tslib_1.__generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, root[refKey_1](tslib_1.__assign(tslib_1.__assign({}, args.where), { where: { id: { eq: val } }, options: { limit: 1 } }), req, gqlInfo)];
                                    case 1: return [4 /*yield*/, (_a.sent()).items()];
                                    case 2:
                                        queryResult = _a.sent();
                                        if (queryResult.length > 0)
                                            return [2 /*return*/, queryResult[0]];
                                        return [2 /*return*/, null];
                                }
                            });
                        }); };
                    });
                    // will do: Category.tasks (actually: Category.tasksOfcategory & tasksOfcategory2)
                    var refT = upsertTypes(getMetaType(ref), 'type_impl_node');
                    var keyOf_1 = key + 'Of' + f.key;
                    refT.fields.push({
                        key: keyOf_1,
                        args: queryArgsConnection,
                        value: connectionKey,
                        order: 10,
                        comment: "List all `".concat(getMetaType(meta), "` of `").concat(refKey_1, "`"),
                    });
                    refT.query.resultProcessors.push(function (r) {
                        var val = r.id;
                        r[keyOf_1] = function (args, req, gqlInfo) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                            var _a;
                            return tslib_1.__generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0: return [4 /*yield*/, root[key]({
                                            where: tslib_1.__assign(tslib_1.__assign({}, args.where), (_a = {}, _a[f.key] = { eq: val }, _a)),
                                            options: tslib_1.__assign(tslib_1.__assign(tslib_1.__assign({}, args.limit), args.page), args.orderBy),
                                        }, req, gqlInfo)];
                                    case 1: return [2 /*return*/, _b.sent()];
                                }
                            });
                        }); };
                    });
                }
                else {
                    currentType.fields.push({
                        key: f.key,
                        value: "".concat(type).concat(f.allowNull ? '' : '!'),
                        comment: f.caption,
                    });
                }
                // sorting
                if (!f.isServerExpression)
                    orderByFields.push("".concat(f.key, ": OrderByDirection"));
                // helper
                var it_is_not_at_ref = ref === undefined;
                // where
                if (it_is_not_at_ref && !f.isServerExpression && !notARealField) {
                    whereTypeFields.push("".concat(f.key, ": Where").concat(type).concat(f.allowNull ? 'Nullable' : ''));
                }
                var includeInUpdateOrInsert = f.options.allowApiUpdate !== false && !notARealField;
                var updateType = it_is_not_at_ref ? type : 'ID';
                if (includeInUpdateOrInsert) {
                    // create
                    if (currentType.mutation.create.input)
                        currentType.mutation.create.input.fields.push({
                            key: f.key,
                            value: updateType,
                        });
                    // update
                    if (currentType.mutation.update.input)
                        currentType.mutation.update.input.fields.push({
                            key: f.key,
                            value: updateType,
                        });
                }
            };
            try {
                for (var _q = (e_6 = void 0, tslib_1.__values(meta.fields)), _r = _q.next(); !_r.done; _r = _q.next()) {
                    var f = _r.value;
                    _loop_2(f);
                }
            }
            catch (e_6_1) { e_6 = { error: e_6_1 }; }
            finally {
                try {
                    if (_r && !_r.done && (_p = _q.return)) _p.call(_q);
                }
                finally { if (e_6) throw e_6.error; }
            }
            currentType.query.orderBy.push(blockFormat({
                prefix: "input ".concat(key, "OrderBy"),
                data: orderByFields,
                comment: "OrderBy options for `".concat(key, "`"),
            }));
            whereTypeFields.push("OR: [".concat(key, "Where!]"));
            if (andImplementation)
                whereTypeFields.push("AND: [".concat(key, "Where!]"));
            currentType.query.whereType.push(blockFormat({
                prefix: "input ".concat(key, "Where"),
                data: whereTypeFields,
                comment: "Where options for `".concat(key, "`"),
            }));
        }
    };
    try {
        for (var entities_1 = tslib_1.__values(entities), entities_1_1 = entities_1.next(); !entities_1_1.done; entities_1_1 = entities_1.next()) {
            var meta = entities_1_1.value;
            _loop_1(meta);
        }
    }
    catch (e_5_1) { e_5 = { error: e_5_1 }; }
    finally {
        try {
            if (entities_1_1 && !entities_1_1.done && (_e = entities_1.return)) _e.call(entities_1);
        }
        finally { if (e_5) throw e_5.error; }
    }
    // Add the node interface at the end
    var nodeKey = 'node';
    root_query.fields.push({
        key: nodeKey,
        args: [argNodeId],
        value: "Node",
        comment: "Grab any Remult entity given it's globally unique `ID`",
    });
    if (v2ConnectionAndPagination) {
        var pageInfo = upsertTypes('PageInfo', 'type', 30);
        pageInfo.fields.push({ key: 'endCursor', value: 'String!' });
        pageInfo.fields.push({ key: 'hasNextPage', value: 'Boolean!' });
        pageInfo.fields.push({ key: 'hasPreviousPage', value: 'Boolean!' });
        pageInfo.fields.push({ key: 'startCursor', value: 'String!' });
    }
    resolversQuery[nodeKey] = function (origItem, args, req, gqlInfo) { return root[nodeKey](args, req, gqlInfo); };
    root[nodeKey] = function (args, req, gqlInfo) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var nodeId, sp, r;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    nodeId = args.nodeId;
                    sp = nodeId.split(':');
                    return [4 /*yield*/, root[toCamelCase(sp[0])]({
                            id: sp[1],
                        }, req, gqlInfo)];
                case 1:
                    r = _a.sent();
                    r.__typename = sp[0];
                    return [2 /*return*/, r];
            }
        });
    }); };
    var orderByDirection = upsertTypes('OrderByDirection', 'enum', 30);
    orderByDirection.comment = "Determines the order of returned elements";
    orderByDirection.fields.push({
        key: 'ASC',
        value: { Enum: true },
        comment: 'Sort data in ascending order',
    });
    orderByDirection.fields.push({
        key: 'DESC',
        value: { Enum: true },
        comment: 'Sort data in descending order',
    });
    var nodeInterface = upsertTypes('Node', 'interface', 31);
    nodeInterface.comment = "Node interface of remult entities (eg: nodeId: `Task:1` so `__typename:id`)";
    nodeInterface.fields.push(argNodeId);
    upsertUnion(argErrorDetail.value, ['ValidationError', 'ForbiddenError', 'NotFoundError'], 32);
    var errorInterface = upsertTypes('Error', 'interface', 33);
    errorInterface.comment = "Error interface of remult entities";
    errorInterface.fields.push({
        key: 'message',
        value: 'String!',
    });
    var validationErrorInterface = upsertTypes('ValidationError', 'type_impl_error', 34);
    validationErrorInterface.comment = "Validation Error";
    validationErrorInterface.fields.push({
        key: 'message',
        value: 'String!',
    });
    validationErrorInterface.fields.push({
        key: 'modelState',
        value: '[ValidationErrorModelState!]!',
    });
    var validationErrorModelStateInterface = upsertTypes('ValidationErrorModelState', 'type', 34);
    validationErrorModelStateInterface.comment = "Validation Error Model State";
    validationErrorModelStateInterface.fields.push({
        key: 'field',
        value: 'String!',
    });
    validationErrorModelStateInterface.fields.push({
        key: 'message',
        value: 'String!',
    });
    // progress: () => { },
    var forbiddenErrorInterface = upsertTypes('ForbiddenError', 'type_impl_error', 34);
    forbiddenErrorInterface.comment = "Forbidden Error";
    forbiddenErrorInterface.fields.push({
        key: 'message',
        value: 'String!',
    });
    var notFoundErrorInterface = upsertTypes('NotFoundError', 'type_impl_error', 34);
    notFoundErrorInterface.comment = "Not Found Error";
    notFoundErrorInterface.fields.push({
        key: 'message',
        value: 'String!',
    });
    return {
        resolvers: resolvers,
        rootValue: root,
        typeDefs: "".concat(types
            .sort(function (a, b) { return (a.order ? a.order : 0) - (b.order ? b.order : 0); })
            .map(function (_a) {
            var key = _a.key, kind = _a.kind, fields = _a.fields, query = _a.query, comment = _a.comment;
            var orderBy = query.orderBy, whereType = query.whereType, whereTypeSubFields = query.whereTypeSubFields;
            var prefix = "".concat(kind, " ").concat(key);
            if (kind === 'type_impl_node') {
                prefix = "type ".concat(key, " implements Node");
            }
            if (kind === 'type_impl_error') {
                prefix = "type ".concat(key, " implements Error");
            }
            var type = kind === 'union'
                ? "union ".concat(key, " = ").concat(fields.map(function (field) { return field.key; }).join(' | '))
                : blockFormat({
                    prefix: prefix,
                    data: fields
                        .sort(function (a, b) { return (a.order ? a.order : 0) - (b.order ? b.order : 0); })
                        .map(function (field) { return fieldFormat(field); }),
                    comment: comment !== null && comment !== void 0 ? comment : "The ".concat(kind, " for `").concat(key, "`"),
                });
            var orderByStr = orderBy.length > 0 ? "\n\n".concat(orderBy.join('\n\n')) : "";
            var whereTypeStr = whereType.length > 0 ? "\n\n".concat(whereType.join('\n\n')) : "";
            var whereTypeSubFieldsStr = whereTypeSubFields.length > 0
                ? "\n\n".concat(whereTypeSubFields.join('\n\n'))
                : "";
            return "".concat(type).concat(orderByStr).concat(whereTypeStr).concat(whereTypeSubFieldsStr);
        })
            .join("\n\n"), "\n"),
    };
    function connectionImplementation(setResult, itemsKey, createResultPromise, dApi, currentType, arg1, meta, totalCountKey) {
        var _a;
        var _this = this;
        setResult((_a = {},
            _a[itemsKey] = createResultPromise(function (response, setResult) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, dApi.getArray(tslib_1.__assign(tslib_1.__assign({}, response), { success: function (x) {
                                    setResult(x.map(function (y) {
                                        var orig = tslib_1.__assign({}, y);
                                        currentType.query.resultProcessors.forEach(function (z) { return z(y, orig); });
                                        return y;
                                    }));
                                } }), {
                                get: bridgeQueryOptionsToDataApiGet(arg1),
                            }, translateWhereToRestBody(meta.fields, arg1))];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); }),
            _a[totalCountKey] = createResultPromise(function (response, setResult) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, dApi.count(tslib_1.__assign(tslib_1.__assign({}, response), { success: function (x) { return setResult(x.count); } }), {
                                get: bridgeQueryOptionsToDataApiGet(arg1),
                            }, translateWhereToRestBody(meta.fields, arg1))];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); }),
            _a));
    }
}
function getQueryArgsConnection(key) {
    var queryArgsConnection = [
        {
            key: 'limit',
            value: 'Int',
            comment: "\nFor **page by page** pagination.\nLimit the number of result. \n_Side note: `Math.ceil(totalCount / limit)` to determine how many pages there are._",
        },
        {
            key: 'page',
            value: 'Int',
            comment: "\nFor **page by page** pagination.\nSelect a dedicated page.",
        },
        {
            key: 'offset',
            value: 'Int',
            comment: "\nFor **page by page** pagination.\nSet the offset needed.\n_Side node: if `page` arg is set, `offset` will be ignored._",
        },
        {
            key: 'orderBy',
            value: "".concat(key, "OrderBy"),
            comment: "Remult sorting options",
        },
        {
            key: 'where',
            value: "".concat(key, "Where"),
            comment: "Remult filtering options",
        },
    ];
    if (v2ConnectionAndPagination) {
        queryArgsConnection.push({
            key: 'first',
            value: 'Int',
            comment: "\n        For **forward cursor** pagination\n        Takes the `first`: `n` elements from the list.",
        }, {
            key: 'after',
            value: 'String',
            comment: "\n        For **forward cursor** pagination\n        `after` this `cursor`.",
        }, {
            key: 'last',
            value: 'Int',
            comment: "\n        For **backward cursor** pagination\n        Takes the `last`: `n` elements from the list.",
        }, {
            key: 'before',
            value: 'String',
            comment: "\n        For **backward cursor** pagination\n        `before` this `cursor`.",
        });
    }
    return queryArgsConnection;
}
// For cursor pagination (v2)
// function checkPaginationArgs(args: any) {
//   let paginationPage = !!args.limit ? 1 : 0
//   paginationPage += !!args.page ? 1 : 0
//   let paginationCursor = !!args.first ? 1 : 0
//   paginationCursor += !!args.after ? 1 : 0
//   paginationCursor += !!args.last ? 1 : 0
//   paginationCursor += !!args.before ? 1 : 0
//   if (paginationPage > 0 && paginationCursor > 0) {
//     throw new GraphQLError(
//       `You can't use \`limit,page\` and \`first,after,last,before\` at the same time. Choose your pagination style.`,
//     )
//   }
// }
function blockFormat(obj) {
    if (obj.data.length === 0) {
        return "";
    }
    var str = "".concat(obj.prefix, " {\n  ").concat(obj.data.join('\n  '), "\n}");
    var commentsStr = "\"\"\"\n".concat(obj.comment, "\n\"\"\"\n");
    if (_removeComments) {
        commentsStr = "";
    }
    return "".concat(commentsStr).concat(str);
}
function argsFormat(args) {
    if (args) {
        return "(".concat(args
            .map(function (arg) {
            var strComment = "\n    \"\"\"\n    ".concat(arg.comment, "\n    \"\"\"\n");
            if (_removeComments || !arg.comment) {
                strComment = "";
            }
            if (strComment) {
                return "".concat(strComment, "    ").concat(arg.key, ": ").concat(arg.value, "\n  ");
            }
            return "".concat(arg.key, ": ").concat(arg.value);
        })
            .join(', '), ")");
    }
    return "";
}
function fieldFormat(field) {
    // First, the comment
    var strComment = "\"\"\"\n  ".concat(field.comment, "\n  \"\"\"\n");
    if (_removeComments || !field.comment) {
        strComment = "";
    }
    var key_value = "".concat(field.key).concat(field.args ? "".concat(argsFormat(field.args)) : "", ": ").concat(field.value);
    // It's an enum
    if (typeof field.value === 'object') {
        key_value = "".concat(field.key);
    }
    return "".concat(strComment, "  ").concat(key_value);
}
function getGraphqlBaseType(field) {
    var _a, _b;
    var type = 'String';
    switch (field.valueType) {
        case Boolean:
            type = 'Boolean';
            break;
        case Number:
            {
                if (((_a = field.valueConverter) === null || _a === void 0 ? void 0 : _a.fieldTypeInDb) === 'integer' ||
                    ((_b = field.valueConverter) === null || _b === void 0 ? void 0 : _b.fieldTypeInDb) === 'autoincrement')
                    type = 'Int';
                else
                    type = 'Float';
            }
            break;
    }
    return type;
}
function getMetaType(entityMeta) {
    return entityMeta.entityType.name;
}
function upperFirstChar(str) {
    return str
        .split('')
        .map(function (c, i) { return (i === 0 ? c.toUpperCase() : c); })
        .join('');
}
function toCamelCase(str) {
    return str
        .split('')
        .map(function (c, i) { return (i === 0 ? c.toLowerCase() : c); })
        .join('');
}
function bridgeQueryOptionsToDataApiGet(arg1) {
    var limit = arg1.limit, page = arg1.page, orderBy = arg1.orderBy, where = arg1.where, offset = arg1.offset;
    if (!page && offset) {
        page = Math.floor(offset / limit) + 1;
    }
    return function (key) {
        if (limit && key === '_limit') {
            return limit;
        }
        if (page && key === '_page') {
            return page;
        }
        if (orderBy) {
            if (key === '_sort') {
                var sort_keys_1 = [];
                Object.keys(orderBy).forEach(function (sort_key) {
                    sort_keys_1.push(sort_key);
                });
                if (sort_keys_1.length > 0) {
                    return sort_keys_1.join(',');
                }
            }
            else if (key === '_order') {
                var sort_directions_1 = [];
                Object.keys(orderBy).forEach(function (sort_key) {
                    var direction = orderBy[sort_key].toLowerCase();
                    sort_directions_1.push(direction);
                });
                if (sort_directions_1.length > 0) {
                    return sort_directions_1.join(',');
                }
            }
        }
    };
}
//@internal
function translateWhereToRestBody(fields, _a) {
    var e_7, _b;
    var where = _a.where;
    if (!where)
        return undefined;
    var result = {};
    var _loop_3 = function (field) {
        var e_8, _c;
        if (field.options.includeInApi === false)
            return "continue";
        var condition = where[field.key];
        if (condition) {
            var tr = function (key, what) {
                var val = condition[key];
                if (val != undefined)
                    what(val);
            };
            var _loop_4 = function (op) {
                tr(op, function (val) { return (result[field.key + '.' + op] = val); });
            };
            try {
                for (var _d = (e_8 = void 0, tslib_1.__values(['gt', 'gte', 'lt', 'lte', 'ne', 'in'])), _e = _d.next(); !_e.done; _e = _d.next()) {
                    var op = _e.value;
                    _loop_4(op);
                }
            }
            catch (e_8_1) { e_8 = { error: e_8_1 }; }
            finally {
                try {
                    if (_e && !_e.done && (_c = _d.return)) _c.call(_d);
                }
                finally { if (e_8) throw e_8.error; }
            }
            tr('nin', function (x) { return (result[field.key + '.ne'] = x); });
            tr('eq', function (x) { return (result[field.key] = x); });
            tr('contains', function (x) { return (result[field.key + '.contains'] = x); });
            tr('notContains', function (x) { return (result[field.key + '.notContains'] = x); });
        }
    };
    try {
        for (var fields_1 = tslib_1.__values(fields), fields_1_1 = fields_1.next(); !fields_1_1.done; fields_1_1 = fields_1.next()) {
            var field = fields_1_1.value;
            _loop_3(field);
        }
    }
    catch (e_7_1) { e_7 = { error: e_7_1 }; }
    finally {
        try {
            if (fields_1_1 && !fields_1_1.done && (_b = fields_1.return)) _b.call(fields_1);
        }
        finally { if (e_7) throw e_7.error; }
    }
    if (where.OR) {
        result.OR = where.OR.map(function (where) { var _a; return (_a = translateWhereToRestBody(fields, { where: where })) === null || _a === void 0 ? void 0 : _a.where; });
    }
    return { where: result };
}

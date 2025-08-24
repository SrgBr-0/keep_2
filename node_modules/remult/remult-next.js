"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.remultNext = remultNext;
exports.remultNextApp = remultNextApp;
var tslib_1 = require("tslib");
var index_js_1 = require("./server/index.js");
function remultNext(options) {
    var _this = this;
    var result = (0, index_js_1.createRemultServer)(options, {
        buildGenericRequestInfo: function (req) { return req; },
        getRequestBody: function (req) { return tslib_1.__awaiter(_this, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
            return [2 /*return*/, req.body];
        }); }); },
    });
    return Object.assign(function (req, res) {
        return result.handle(req, res).then(function () { });
    }, result, {
        getRemult: function (req) { return result.getRemult(req); },
        openApiDoc: function (arg) { return result.openApiDoc(arg); },
        withRemult: function (req, what) {
            return result.withRemultAsync(req, what);
        },
    }, {
        getServerSideProps: function (getServerPropsFunction) {
            return function (context) {
                return new Promise(function (res, err) {
                    result.withRemult(context, undefined, function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                        var r, e_1;
                        return tslib_1.__generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    return [4 /*yield*/, getServerPropsFunction(context)];
                                case 1:
                                    r = _a.sent();
                                    res(JSON.parse(JSON.stringify(r)));
                                    return [3 /*break*/, 3];
                                case 2:
                                    e_1 = _a.sent();
                                    err(e_1);
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                });
            };
        },
        handle: function (handler) {
            return function (req, res) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var _this = this;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, new Promise(function (resolve) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                var _this = this;
                                return tslib_1.__generator(this, function (_a) {
                                    result.withRemult(req, res, function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                        return tslib_1.__generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0: return [4 /*yield*/, handler(req, res)];
                                                case 1:
                                                    _a.sent();
                                                    resolve();
                                                    return [2 /*return*/];
                                            }
                                        });
                                    }); });
                                    return [2 /*return*/];
                                });
                            }); })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); };
        },
    });
}
var encoder = new TextEncoder();
function remultNextApp(options) {
    var _this = this;
    var result = (0, index_js_1.createRemultServer)(options, {
        getRequestBody: function (req) { return req.json(); },
        buildGenericRequestInfo: function (req) { return ({
            url: req === null || req === void 0 ? void 0 : req.url,
            method: req === null || req === void 0 ? void 0 : req.method,
            on: function (e, do1) {
                if (e === 'close') {
                    ;
                    req['_tempOnClose'] = do1;
                }
            },
        }); },
    });
    var handler = function (req) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var sseResponse_1, response_1, responseFromRemultHandler;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sseResponse_1 = undefined;
                    req['_tempOnClose'] = function () { };
                    response_1 = {
                        end: function () { },
                        json: function () { },
                        send: function () { },
                        status: function () {
                            return response_1;
                        },
                        write: function () { },
                        writeHead: function (status, headers) {
                            if (status === 200 && headers) {
                                var contentType = headers['Content-Type'];
                                if (contentType === 'text/event-stream') {
                                    var messages_1 = [];
                                    response_1.write = function (x) { return messages_1.push(x); };
                                    var stream = new ReadableStream({
                                        start: function (controller) {
                                            var e_2, _a;
                                            try {
                                                for (var messages_2 = tslib_1.__values(messages_1), messages_2_1 = messages_2.next(); !messages_2_1.done; messages_2_1 = messages_2.next()) {
                                                    var message = messages_2_1.value;
                                                    controller.enqueue(encoder.encode(message));
                                                }
                                            }
                                            catch (e_2_1) { e_2 = { error: e_2_1 }; }
                                            finally {
                                                try {
                                                    if (messages_2_1 && !messages_2_1.done && (_a = messages_2.return)) _a.call(messages_2);
                                                }
                                                finally { if (e_2) throw e_2.error; }
                                            }
                                            response_1.write = function (data) {
                                                controller.enqueue(encoder.encode(data));
                                            };
                                        },
                                        cancel: function () {
                                            response_1.write = function () { };
                                            req['_tempOnClose']();
                                        },
                                    });
                                    sseResponse_1 = new Response(stream, { headers: headers });
                                }
                            }
                        },
                    };
                    return [4 /*yield*/, result.handle(req, response_1)];
                case 1:
                    responseFromRemultHandler = _a.sent();
                    if (sseResponse_1 !== undefined) {
                        return [2 /*return*/, sseResponse_1];
                    }
                    if (responseFromRemultHandler) {
                        if (responseFromRemultHandler.html)
                            return [2 /*return*/, new Response(responseFromRemultHandler.html, {
                                    status: responseFromRemultHandler.statusCode,
                                    headers: {
                                        'Content-Type': 'text/html',
                                    },
                                })];
                        return [2 /*return*/, new Response(JSON.stringify(responseFromRemultHandler.data), {
                                status: responseFromRemultHandler.statusCode,
                            })];
                    }
                    if (!responseFromRemultHandler) {
                        return [2 /*return*/, new Response('', {
                                status: 404,
                            })];
                    }
                    return [2 /*return*/];
            }
        });
    }); };
    return {
        getRemult: function (req) { return result.getRemult(req); },
        openApiDoc: function (options) { return result.openApiDoc(options); },
        GET: handler,
        POST: handler,
        PUT: handler,
        DELETE: handler,
        withRemult: function (what) {
            return result.withRemultAsync({}, what);
        },
    };
}

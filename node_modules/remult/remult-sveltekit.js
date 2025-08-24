"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.remultSveltekit = remultSveltekit;
var tslib_1 = require("tslib");
var index_js_1 = require("./server/index.js");
function remultSveltekit(options) {
    var _this = this;
    var result = (0, index_js_1.createRemultServer)(options, {
        buildGenericRequestInfo: function (event) { return ({
            url: event.request.url,
            method: event.request.method,
            on: function (e, do1) {
                if (e === 'close') {
                    ;
                    event.locals['_tempOnClose'] = do1;
                }
            },
        }); },
        getRequestBody: function (event) { return event.request.json(); },
    });
    var serverHandler = function (event) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var sseResponse, response, responseFromRemultHandler, res;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sseResponse = undefined;
                    event.locals['_tempOnClose'] = function () { };
                    response = {
                        end: function () { },
                        json: function () { },
                        send: function () { },
                        status: function () {
                            return response;
                        },
                        write: function () { },
                        writeHead: function (status, headers) {
                            if (status === 200 && headers) {
                                var contentType = headers['Content-Type'];
                                if (contentType === 'text/event-stream') {
                                    var messages_1 = [];
                                    response.write = function (x) { return messages_1.push(x); };
                                    var stream = new ReadableStream({
                                        start: function (controller) {
                                            var e_1, _a;
                                            try {
                                                for (var messages_2 = tslib_1.__values(messages_1), messages_2_1 = messages_2.next(); !messages_2_1.done; messages_2_1 = messages_2.next()) {
                                                    var message = messages_2_1.value;
                                                    controller.enqueue(message);
                                                }
                                            }
                                            catch (e_1_1) { e_1 = { error: e_1_1 }; }
                                            finally {
                                                try {
                                                    if (messages_2_1 && !messages_2_1.done && (_a = messages_2.return)) _a.call(messages_2);
                                                }
                                                finally { if (e_1) throw e_1.error; }
                                            }
                                            response.write = function (data) {
                                                controller.enqueue(data);
                                            };
                                        },
                                        cancel: function () {
                                            response.write = function () { };
                                            event.locals['_tempOnClose']();
                                        },
                                    });
                                    sseResponse = new Response(stream, { headers: headers });
                                }
                            }
                        },
                    };
                    return [4 /*yield*/, result.handle(event, response)];
                case 1:
                    responseFromRemultHandler = _a.sent();
                    if (sseResponse !== undefined) {
                        return [2 /*return*/, sseResponse];
                    }
                    if (responseFromRemultHandler !== undefined) {
                        if (responseFromRemultHandler.html)
                            return [2 /*return*/, new Response(responseFromRemultHandler.html, {
                                    status: responseFromRemultHandler.statusCode,
                                    headers: {
                                        'Content-Type': 'text/html',
                                    },
                                })];
                        res = new Response(JSON.stringify(responseFromRemultHandler.data), {
                            status: responseFromRemultHandler.statusCode,
                        });
                        return [2 /*return*/, res];
                    }
                    return [2 /*return*/, new Response('Not Found', {
                            status: 404,
                        })];
            }
        });
    }); };
    var handler = function (_a) { return tslib_1.__awaiter(_this, [_a], void 0, function (_b) {
        var _this = this;
        var event = _b.event, resolve = _b.resolve;
        return tslib_1.__generator(this, function (_c) {
            return [2 /*return*/, result.withRemultAsync(event, function () { return tslib_1.__awaiter(_this, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, resolve(event)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                }); }); })];
        });
    }); };
    return Object.assign(handler, {
        getRemult: function (req) { return result.getRemult(req); },
        openApiDoc: function (options) { return result.openApiDoc(options); },
        withRemult: function (request, what) {
            return result.withRemultAsync(request, what);
        },
        hookHandler: handler,
        GET: serverHandler,
        PUT: serverHandler,
        POST: serverHandler,
        DELETE: serverHandler,
    });
}

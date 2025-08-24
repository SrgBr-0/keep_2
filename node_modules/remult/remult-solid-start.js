"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.remultSolidStart = remultSolidStart;
var tslib_1 = require("tslib");
var web_1 = require("solid-js/web");
var index_js_1 = require("./server/index.js");
function remultSolidStart(options) {
    var _this = this;
    var result = (0, index_js_1.createRemultServer)(options, {
        buildGenericRequestInfo: function (event) { return ({
            url: event.request.url,
            method: event.request.method,
            on: function (e, do1) {
                if (e === 'close') {
                    event.locals['_tempOnClose'] = do1;
                }
            },
        }); },
        getRequestBody: function (event) { return event.request.json(); },
    });
    var serverHandler = function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var event, sseResponse, response, responseFromRemultHandler, res;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, web_1.getRequestEvent)()];
                case 1:
                    event = _a.sent();
                    sseResponse = undefined;
                    if (event)
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
                                            var _a, _b;
                                            response.write = function () { };
                                            (_b = (_a = event === null || event === void 0 ? void 0 : event.locals) === null || _a === void 0 ? void 0 : _a['_tempOnClose']) === null || _b === void 0 ? void 0 : _b.call(_a);
                                        },
                                    });
                                    sseResponse = new Response(stream, { headers: headers });
                                }
                            }
                        },
                    };
                    return [4 /*yield*/, result.handle(event, response)];
                case 2:
                    responseFromRemultHandler = _a.sent();
                    if (sseResponse !== undefined) {
                        return [2 /*return*/, sseResponse];
                    }
                    if (responseFromRemultHandler) {
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
    var handler = {}; //async ({ event, resolve }) => {
    //   if (event.url.pathname.startsWith(options!.rootPath!)) {
    //     const result = await serverHandler(event)
    //     if (result != null && result?.status != 404) return result
    //   }
    //   return new Promise<Response>((res) => {
    //     result.withRemult(event, undefined!, async () => {
    //       res(await resolve(event))
    //     })
    //   })
    // }
    return Object.assign(handler, {
        getRemult: function (req) { return result.getRemult(req); },
        openApiDoc: function (options) { return result.openApiDoc(options); },
        withRemult: function (what) {
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                var _a, _b;
                return tslib_1.__generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _b = (_a = result).withRemultAsync;
                            return [4 /*yield*/, (0, web_1.getRequestEvent)()];
                        case 1: return [2 /*return*/, _b.apply(_a, [_c.sent(), what])];
                    }
                });
            });
        },
        GET: serverHandler,
        PUT: serverHandler,
        POST: serverHandler,
        DELETE: serverHandler,
    });
}

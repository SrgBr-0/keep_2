"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.remultHono = remultHono;
var tslib_1 = require("tslib");
var hono_1 = require("hono");
var streaming_1 = require("hono/streaming");
var index_js_1 = require("./server/index.js");
function remultHono(options) {
    var _this = this;
    var app = new hono_1.Hono();
    var api = (0, index_js_1.createRemultServer)(options, {
        buildGenericRequestInfo: function (c) {
            return {
                method: c.req.method,
                params: c.req.param(),
                query: new Proxy(c.req, {
                    get: function (target, prop) {
                        var r = c.req.queries(prop);
                        if ((r === null || r === void 0 ? void 0 : r.length) == 1)
                            return r[0];
                        return r;
                    },
                }),
                url: c.req.url,
                on: function (e, do1) {
                    ;
                    c['_tempOnClose'](function () { return do1(); });
                    //   c.req.on('close', do1)
                },
            };
        },
        getRequestBody: function (c) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, c.req.json()];
            });
        }); },
    });
    var honoRouter = {
        route: function (path) {
            var r = {
                get: function (handler) {
                    app.get(path, honoHandler(handler));
                    return r;
                },
                post: function (handler) {
                    app.post(path, honoHandler(handler));
                    return r;
                },
                put: function (handler) {
                    app.put(path, honoHandler(handler));
                    return r;
                },
                delete: function (handler) {
                    app.delete(path, honoHandler(handler));
                    return r;
                },
            };
            return r;
            function honoHandler(handler) {
                return function (c) {
                    return new Promise(function (res, rej) {
                        try {
                            var result_1;
                            var sse_1;
                            var gRes_1 = {
                                json: function (data) {
                                    res(c.json(data));
                                },
                                status: function (status) {
                                    result_1 = c.status(status);
                                    return gRes_1;
                                },
                                end: function () {
                                    if (sse_1)
                                        sse_1.close();
                                    else
                                        res(c.body(null));
                                },
                                send: function (data) {
                                    res(c.html(data));
                                },
                                write: function (data) {
                                    sse_1.write(data);
                                },
                                writeHead: function (status, headers) {
                                    res((0, streaming_1.streamSSE)(c, function (s) {
                                        sse_1 = s;
                                        return new Promise(function (res) {
                                            ;
                                            c['_tempOnClose'] = function (x) {
                                                return sse_1.onAbort(function () { return x(); });
                                            };
                                        });
                                    }));
                                },
                            };
                            handler(c, gRes_1, function () { });
                        }
                        catch (err) {
                            rej(err);
                        }
                    });
                };
            }
        },
    };
    api.registerRouter(honoRouter);
    return Object.assign(app, {
        getRemult: function (c) { return api.getRemult(c); },
        openApiDoc: function (options) { return api.openApiDoc(options); },
        withRemult: function (c, what) { return tslib_1.__awaiter(_this, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
            return [2 /*return*/, api.withRemultAsync(c, what)];
        }); }); },
    });
}

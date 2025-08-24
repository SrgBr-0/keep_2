"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.remultHapi = remultHapi;
var tslib_1 = require("tslib");
var index_js_1 = require("./server/index.js");
var stream_1 = require("stream");
function remultHapi(options) {
    var _this = this;
    var api = (0, index_js_1.createRemultServer)(options, {
        buildGenericRequestInfo: function (req) { return ({
            method: req.method,
            params: req.params,
            query: req.query,
            url: req.url.pathname,
            on: function (e, do1) {
                req.raw.req.on('close', do1);
            },
        }); },
        getRequestBody: function (req) { return tslib_1.__awaiter(_this, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
            return [2 /*return*/, req.payload];
        }); }); },
    });
    var routesPlugin = {
        name: 'remultPlugin',
        register: function (server) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            function hapiHandler(handler) {
                return function (request, h) {
                    return new Promise(function (res, rej) {
                        var status = 200;
                        var stream;
                        var r = {
                            status: function (statusCode) {
                                status = statusCode;
                                return r;
                            },
                            end: function () {
                                res(h.response().code(status));
                            },
                            send: function (html) {
                                res(h.response(html).code(status));
                            },
                            json: function (data) {
                                res(h.response(data === null ? 'null' : data).code(status));
                            },
                            write: function (data) {
                                stream.write(data);
                            },
                            writeHead: function (status, headers) {
                                stream = new stream_1.PassThrough();
                                res(h
                                    .response(stream)
                                    .header('content-type', 'text/event-stream')
                                    .header('content-encoding', 'identity'));
                            },
                        };
                        try {
                            Object.assign(request, {
                                on: function (event, listener) {
                                    request.raw.req.on('close', function () {
                                        listener();
                                        console.log('Connection closed');
                                    });
                                },
                            });
                            handler(request, r, function () { });
                        }
                        catch (err) {
                            rej(err);
                        }
                    });
                };
            }
            var hapiRouter;
            return tslib_1.__generator(this, function (_a) {
                hapiRouter = {
                    route: function (path) {
                        path = path.replace(/:id\b/g, '{id}');
                        var r = {
                            get: function (handler) {
                                server.route({
                                    method: 'GET',
                                    path: path,
                                    handler: hapiHandler(handler),
                                });
                                return r;
                            },
                            post: function (handler) {
                                server.route({
                                    method: 'POST',
                                    path: path,
                                    handler: hapiHandler(handler),
                                });
                                return r;
                            },
                            put: function (handler) {
                                server.route({
                                    method: 'PUT',
                                    path: path,
                                    handler: hapiHandler(handler),
                                });
                                return r;
                            },
                            delete: function (handler) {
                                server.route({
                                    method: 'DELETE',
                                    path: path,
                                    handler: hapiHandler(handler),
                                });
                                return r;
                            },
                        };
                        return r;
                    },
                };
                api.registerRouter(hapiRouter);
                return [2 /*return*/];
            });
        }); },
    };
    return Object.assign(routesPlugin, {
        getRemult: function (x) { return api.getRemult(x); },
        openApiDoc: function (x) { return api.openApiDoc(x); },
        withRemult: function (req, what) {
            return api.withRemultAsync(req, what);
        },
    });
}

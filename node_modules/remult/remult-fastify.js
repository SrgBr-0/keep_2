"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.remultFastify = remultFastify;
var tslib_1 = require("tslib");
var index_js_1 = require("./server/index.js");
function remultFastify(options) {
    var _this = this;
    function fastifyHandler(handler) {
        var response = function (req, res) {
            var myRes = {
                status: function (statusCode) {
                    res.status(statusCode);
                    return myRes;
                },
                end: function () {
                    res.send();
                },
                send: function (html) {
                    res.type('text/html').send(html);
                },
                json: function (data) {
                    res.send(data);
                },
                write: function (data) {
                    res.raw.write(data);
                },
                writeHead: function (status, headers) {
                    res.raw.writeHead(status, headers);
                },
            };
            Object.assign(req, {
                on: function (event, listener) {
                    req.raw.on(event, listener);
                },
            });
            handler(req, myRes, function () { });
        };
        return response;
    }
    var api = (0, index_js_1.createRemultServer)(options, {
        buildGenericRequestInfo: function (req) { return req; },
        getRequestBody: function (req) { return tslib_1.__awaiter(_this, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
            return [2 /*return*/, req.body];
        }); }); },
    });
    var pluginFunction = function (instance, op) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var fastifyRouter;
        return tslib_1.__generator(this, function (_a) {
            fastifyRouter = {
                route: function (path) {
                    var r = {
                        delete: function (handler) {
                            instance.delete(path, fastifyHandler(handler));
                            return r;
                        },
                        get: function (handler) {
                            instance.get(path, fastifyHandler(handler));
                            return r;
                        },
                        post: function (handler) {
                            instance.post(path, fastifyHandler(handler));
                            return r;
                        },
                        put: function (handler) {
                            instance.put(path, fastifyHandler(handler));
                            return r;
                        },
                    };
                    return r;
                },
            };
            api.registerRouter(fastifyRouter);
            return [2 /*return*/];
        });
    }); };
    return Object.assign(pluginFunction, {
        getRemult: function (x) { return api.getRemult(x); },
        openApiDoc: function (x) { return api.openApiDoc(x); },
        withRemult: function (req, what) {
            return api.withRemultAsync(req, what);
        },
    });
}

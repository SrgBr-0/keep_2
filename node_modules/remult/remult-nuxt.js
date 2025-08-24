"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.remultNuxt = remultNuxt;
var tslib_1 = require("tslib");
var h3_1 = require("h3");
var index_js_1 = require("./server/index.js");
function remultNuxt(options) {
    var _this = this;
    var result = (0, index_js_1.createRemultServer)(options, {
        buildGenericRequestInfo: function (event) {
            return {
                method: event.node.req.method,
                url: event.node.req.url,
                on: function (a, b) {
                    return event.node.req.on('close', function () {
                        b();
                    });
                },
            };
        },
        getRequestBody: function (event) { return tslib_1.__awaiter(_this, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, h3_1.readBody)(event)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        }); }); },
    });
    var handler = function (event) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var sse, response, r;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sse = false;
                    response = {
                        end: function () { },
                        send: function () { },
                        json: function () { },
                        status: function () {
                            return response;
                        },
                        write: function (what) {
                            event.node.res.write(what);
                        },
                        writeHead: function (status, headers) {
                            sse = true;
                            event.node.res.writeHead(status, headers);
                        },
                    };
                    return [4 /*yield*/, result.handle(event, response)];
                case 1:
                    r = _a.sent();
                    if (!sse) return [3 /*break*/, 3];
                    return [4 /*yield*/, new Promise(function (resolve) {
                            event.node.req.on('close', function () { return resolve({}); });
                        })];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    if (r) {
                        if (r.statusCode !== 200)
                            (0, h3_1.setResponseStatus)(event, r.statusCode);
                        if (r.html)
                            return [2 /*return*/, r.html];
                        return [2 /*return*/, r.data == null ? 'null' : r.data];
                    }
                    return [2 /*return*/];
            }
        });
    }); };
    return Object.assign(handler, {
        getRemult: function (req) { return result.getRemult(req); },
        openApiDoc: function (options) { return result.openApiDoc(options); },
        withRemult: function (request, what) {
            return result.withRemultAsync(request, what);
        },
    });
}

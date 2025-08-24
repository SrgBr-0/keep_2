"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.remultFresh = remultFresh;
var tslib_1 = require("tslib");
var remult_api_server_js_1 = require("./server/remult-api-server.js");
function remultFresh(options, response) {
    var _this = this;
    var server = (0, remult_api_server_js_1.createRemultServerCore)(options, {
        buildGenericRequestInfo: function (r) { return r; },
        getRequestBody: function (req) { return req.json(); },
    });
    return {
        getRemult: function (r) { return server.getRemult(r); },
        openApiDoc: function (x) { return server.openApiDoc(x); },
        handle: function (req, ctx) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var init, res;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        init = {};
                        return [4 /*yield*/, server.handle(req)];
                    case 1:
                        res = _a.sent();
                        if (res) {
                            init.status = res.statusCode;
                            if (res.data) {
                                return [2 /*return*/, response.json(res.data, init)];
                            }
                            else
                                return [2 /*return*/, new response(undefined, init)];
                        }
                        else {
                            return [2 /*return*/, ctx.next()];
                        }
                        return [2 /*return*/];
                }
            });
        }); },
    };
}

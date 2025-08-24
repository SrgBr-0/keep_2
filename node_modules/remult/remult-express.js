"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.remultExpress = remultExpress;
var tslib_1 = require("tslib");
var express = tslib_1.__importStar(require("express"));
var index_js_1 = require("./server/index.js");
function remultExpress(options) {
    var _this = this;
    var app = express.Router();
    if (!options) {
        options = {};
    }
    if (options.bodySizeLimit === undefined) {
        options.bodySizeLimit = '10mb';
    }
    if ((options === null || options === void 0 ? void 0 : options.bodyParser) !== false) {
        app.use(express.json({ limit: options.bodySizeLimit }));
        app.use(express.urlencoded({ extended: true, limit: options.bodySizeLimit }));
    }
    var server = (0, index_js_1.createRemultServer)(options, {
        buildGenericRequestInfo: function (req) { return req; },
        getRequestBody: function (req) { return tslib_1.__awaiter(_this, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
            return [2 /*return*/, req.body];
        }); }); },
    });
    server.registerRouter(app);
    return Object.assign(app, {
        getRemult: function (req) { return server.getRemult(req); },
        openApiDoc: function (options) { return server.openApiDoc(options); },
        withRemult: function (req, res, next) { return server.withRemult(req, res, next); },
        withRemultAsync: function (req, what) {
            return server.withRemultAsync(req, what);
        },
    });
}

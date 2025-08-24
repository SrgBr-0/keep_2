"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeToLog = writeToLog;
var tslib_1 = require("tslib");
function writeToLog(what) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (typeof what !== 'string')
                        what = JSON.stringify(what, undefined, 2);
                    return [4 /*yield*/, Promise.resolve().then(function () { return tslib_1.__importStar(require('fs')); })];
                case 1:
                    (_a.sent()).appendFileSync('./tmp/test.log', what + '\n');
                    return [2 /*return*/];
            }
        });
    });
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UrlBuilder = void 0;
var UrlBuilder = /** @class */ (function () {
    function UrlBuilder(url) {
        this.url = url;
    }
    UrlBuilder.prototype.add = function (key, value) {
        if (this.url.indexOf('?') >= 0)
            this.url += '&';
        else
            this.url += '?';
        this.url += encodeURIComponent(key) + '=' + encodeURIComponent(value);
    };
    UrlBuilder.prototype.addObject = function (object, suffix) {
        if (suffix === void 0) { suffix = ''; }
        if (object != undefined)
            for (var key in object) {
                var val = object[key];
                this.add(key + suffix, val);
            }
    };
    return UrlBuilder;
}());
exports.UrlBuilder = UrlBuilder;

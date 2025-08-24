"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscribableImp = void 0;
var SubscribableImp = /** @class */ (function () {
    function SubscribableImp() {
    }
    SubscribableImp.prototype.reportChanged = function () {
        if (this._subscribers)
            this._subscribers.forEach(function (x) { return x.reportChanged(); });
    };
    SubscribableImp.prototype.reportObserved = function () {
        if (this._subscribers)
            this._subscribers.forEach(function (x) { return x.reportObserved(); });
    };
    SubscribableImp.prototype.subscribe = function (listener) {
        var _this = this;
        var list;
        if (typeof listener === 'function')
            list = {
                reportChanged: function () { return listener(); },
                reportObserved: function () { },
            };
        else
            list = listener;
        if (!this._subscribers) {
            this._subscribers = [];
        }
        this._subscribers.push(list);
        return function () {
            return (_this._subscribers = _this._subscribers.filter(function (x) { return x != list; }));
        };
    };
    return SubscribableImp;
}());
exports.SubscribableImp = SubscribableImp;

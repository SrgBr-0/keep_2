"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clientConnection = exports.SseSubscriptionServer = void 0;
var tslib_1 = require("tslib");
var uuid_1 = require("uuid");
var SseSubscriptionClient_js_1 = require("./src/live-query/SseSubscriptionClient.js");
var SseSubscriptionServer = /** @class */ (function () {
    function SseSubscriptionServer(canUserConnectToChannel) {
        this.canUserConnectToChannel = canUserConnectToChannel;
        //@internal
        this.connections = [];
        //@internal
        this.debugMessageFileSaver = function (id, channel, message) { };
        //@internal
        this.debugFileSaver = function () { };
        if (!this.canUserConnectToChannel) {
            this.canUserConnectToChannel = function () { return true; };
        }
    }
    //@internal
    SseSubscriptionServer.prototype.subscribeToChannel = function (_a, res, remult, remove) {
        var e_1, _b;
        var channel = _a.channel, clientId = _a.clientId;
        if (remove === void 0) { remove = false; }
        try {
            for (var _c = tslib_1.__values(this.connections), _d = _c.next(); !_d.done; _d = _c.next()) {
                var c = _d.value;
                if (c.connectionId === clientId) {
                    if (this.canUserConnectToChannel(channel, remult)) {
                        if (remove)
                            delete c.channels[channel];
                        else
                            c.channels[channel] = true;
                        res.success({ status: 'ok' });
                        this.debug();
                        return;
                    }
                    else {
                        res.forbidden();
                        this.debug();
                        return;
                    }
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_b = _c.return)) _b.call(_c);
            }
            finally { if (e_1) throw e_1.error; }
        }
        res.success(SseSubscriptionClient_js_1.ConnectionNotFoundError);
    };
    SseSubscriptionServer.prototype.publishMessage = function (channel, message) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var data, _a, _b, sc;
            var e_2, _c;
            return tslib_1.__generator(this, function (_d) {
                data = JSON.stringify({ channel: channel, data: message });
                try {
                    for (_a = tslib_1.__values(this.connections), _b = _a.next(); !_b.done; _b = _a.next()) {
                        sc = _b.value;
                        if (sc.channels[channel]) {
                            this.debugMessageFileSaver(sc.connectionId, channel, message);
                            sc.write(data);
                        }
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
                return [2 /*return*/];
            });
        });
    };
    //@internal
    SseSubscriptionServer.prototype.openHttpServerStream = function (req, res) {
        var _this = this;
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            Connection: 'keep-alive',
        });
        var cc = new clientConnection(res);
        //const lastEventId = req.headers['last-event-id'];
        this.connections.push(cc);
        this.debug();
        //@ts-ignore
        req.on('close', function () {
            cc.close();
            _this.connections = _this.connections.filter(function (s) { return s !== cc; });
            _this.debug();
        });
        return cc;
    };
    //@internal
    SseSubscriptionServer.prototype.debug = function () {
        this.debugFileSaver(this.connections.map(function (x) { return ({
            id: x.connectionId,
            channels: x.channels,
        }); }));
    };
    return SseSubscriptionServer;
}());
exports.SseSubscriptionServer = SseSubscriptionServer;
var clientConnection = /** @class */ (function () {
    function clientConnection(response) {
        this.response = response;
        this.channels = {};
        this.closed = false;
        this.connectionId = (0, uuid_1.v4)();
        this.write(this.connectionId, 'connectionId');
        this.sendLiveMessage();
    }
    clientConnection.prototype.close = function () {
        if (this.timeOutRef)
            clearTimeout(this.timeOutRef);
        this.closed = true;
    };
    clientConnection.prototype.write = function (eventData, eventType) {
        if (eventType === void 0) { eventType = 'message'; }
        var event = 'event:' + eventType;
        // if (id != undefined)
        //     event += "\nid:" + id;
        this.response.write(event + '\ndata:' + eventData + '\n\n');
        if (this.response.flush)
            this.response.flush();
    };
    clientConnection.prototype.sendLiveMessage = function () {
        var _this = this;
        if (this.closed)
            return;
        this.write('', 'keep-alive');
        this.timeOutRef = setTimeout(function () {
            _this.sendLiveMessage();
        }, 45000);
    };
    return clientConnection;
}());
exports.clientConnection = clientConnection;

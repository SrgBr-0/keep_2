import { v4 as uuid } from 'uuid';
import { ConnectionNotFoundError } from './src/live-query/SseSubscriptionClient.js';
export class SseSubscriptionServer {
    canUserConnectToChannel;
    //@internal
    subscribeToChannel({ channel, clientId }, res, remult, remove = false) {
        for (const c of this.connections) {
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
        res.success(ConnectionNotFoundError);
    }
    //@internal
    connections = [];
    constructor(canUserConnectToChannel) {
        this.canUserConnectToChannel = canUserConnectToChannel;
        if (!this.canUserConnectToChannel) {
            this.canUserConnectToChannel = () => true;
        }
    }
    async publishMessage(channel, message) {
        const data = JSON.stringify({ channel, data: message });
        for (const sc of this.connections) {
            if (sc.channels[channel]) {
                this.debugMessageFileSaver(sc.connectionId, channel, message);
                sc.write(data);
            }
        }
    }
    //@internal
    debugMessageFileSaver = (id, channel, message) => { };
    //@internal
    openHttpServerStream(req, res) {
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            Connection: 'keep-alive',
        });
        const cc = new clientConnection(res);
        //const lastEventId = req.headers['last-event-id'];
        this.connections.push(cc);
        this.debug();
        //@ts-ignore
        req.on('close', () => {
            cc.close();
            this.connections = this.connections.filter((s) => s !== cc);
            this.debug();
        });
        return cc;
    }
    //@internal
    debug() {
        this.debugFileSaver(this.connections.map((x) => ({
            id: x.connectionId,
            channels: x.channels,
        })));
    }
    //@internal
    debugFileSaver = () => { };
}
export class clientConnection {
    response;
    channels = {};
    timeOutRef;
    close() {
        if (this.timeOutRef)
            clearTimeout(this.timeOutRef);
        this.closed = true;
    }
    closed = false;
    write(eventData, eventType = 'message') {
        let event = 'event:' + eventType;
        // if (id != undefined)
        //     event += "\nid:" + id;
        this.response.write(event + '\ndata:' + eventData + '\n\n');
        if (this.response.flush)
            this.response.flush();
    }
    connectionId = uuid();
    constructor(response) {
        this.response = response;
        this.write(this.connectionId, 'connectionId');
        this.sendLiveMessage();
    }
    sendLiveMessage() {
        if (this.closed)
            return;
        this.write('', 'keep-alive');
        this.timeOutRef = setTimeout(() => {
            this.sendLiveMessage();
        }, 45000);
    }
}

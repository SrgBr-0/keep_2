export class AblySubscriptionClient {
    ably;
    constructor(ably) {
        this.ably = ably;
    }
    async openConnection(onReconnect) {
        return {
            close: () => {
                // Since we did not open the connection, we do not close it
            },
            subscribe: async (channel, handler) => {
                let myHandler = (y) => handler(y.data);
                await this.ably.channels.get(channel).subscribe((y) => myHandler(y));
                return () => {
                    myHandler = () => { };
                    this.ably.channels.get(channel).unsubscribe();
                };
            },
        };
    }
}
export class AblySubscriptionServer {
    ably;
    constructor(ably) {
        this.ably = ably;
    }
    async publishMessage(channel, message) {
        await this.ably.channels.get(channel).publish({ data: message });
    }
}

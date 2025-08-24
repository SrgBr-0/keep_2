import { buildRestDataProvider } from '../buildRestDataProvider.js';
import { remult } from '../remult-proxy.js';
import { remultStatic } from '../remult-static.js';
import { flags } from '../remult3/remult3.js';
import { streamUrl } from './SubscriptionChannel.js';
export class SseSubscriptionClient {
    openConnection(onReconnect) {
        let connectionId;
        const channels = new Map();
        const provider = buildRestDataProvider(remult.apiClient.httpClient);
        let connected = false;
        let source;
        const client = {
            close() {
                source.close();
            },
            async subscribe(channel, handler) {
                let listeners = channels.get(channel);
                if (!listeners) {
                    channels.set(channel, (listeners = []));
                    await subscribeToChannel(channel);
                }
                listeners.push(handler);
                return () => {
                    listeners.splice(listeners.indexOf(handler, 1));
                    if (listeners.length == 0) {
                        remultStatic.actionInfo.runActionWithoutBlockingUI(() => provider.post(remult.apiClient.url + '/' + streamUrl + '/unsubscribe', {
                            channel: channel,
                            clientId: connectionId,
                        }));
                        channels.delete(channel);
                    }
                };
            },
        };
        const createConnectionPromise = () => new Promise((res) => {
            createConnection();
            let retryCount = 0;
            function createConnection() {
                if (source)
                    source.close();
                source = SseSubscriptionClient.createEventSource(remult.apiClient.url + '/' + streamUrl);
                source.onmessage = (e) => {
                    let message = JSON.parse(e.data);
                    const listeners = channels.get(message.channel);
                    if (listeners)
                        listeners.forEach((x) => x(message.data));
                };
                source.onerror = (e) => {
                    console.error('Live Query Event Source Error', e);
                    source.close();
                    if (retryCount++ < flags.error500RetryCount) {
                        setTimeout(() => {
                            createConnection();
                        }, 500);
                    }
                };
                source.addEventListener('connectionId', async (e) => {
                    //@ts-ignore
                    connectionId = e.data;
                    if (connected) {
                        for (const channel of channels.keys()) {
                            await subscribeToChannel(channel);
                        }
                        onReconnect();
                    }
                    else {
                        connected = true;
                        res(client);
                    }
                });
            }
        });
        return createConnectionPromise();
        async function subscribeToChannel(channel) {
            const result = await remultStatic.actionInfo.runActionWithoutBlockingUI(() => {
                return provider.post(remult.apiClient.url + '/' + streamUrl + '/subscribe', {
                    channel: channel,
                    clientId: connectionId,
                });
            });
            if (result === ConnectionNotFoundError) {
                await createConnectionPromise();
            }
        }
    }
    static createEventSource(url) {
        return new EventSource(url, {
            withCredentials: true,
        });
    }
}
export const ConnectionNotFoundError = 'client connection not found';

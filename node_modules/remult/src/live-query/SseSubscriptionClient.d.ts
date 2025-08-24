import type { SubscriptionClient, SubscriptionClientConnection } from './SubscriptionChannel.js';
export declare class SseSubscriptionClient implements SubscriptionClient {
    openConnection(onReconnect: VoidFunction): Promise<SubscriptionClientConnection>;
    static createEventSource(url: string): EventSource;
}
export declare const ConnectionNotFoundError = "client connection not found";

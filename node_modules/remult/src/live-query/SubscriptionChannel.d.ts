import type { Remult } from '../context.js';
export declare const streamUrl = "stream";
export interface SubscriptionListener<type> {
    next(message: type): void;
    error(err: any): void;
    complete(): void;
}
export type Unsubscribe = VoidFunction;
export interface SubscriptionClientConnection {
    subscribe(channel: string, onMessage: (message: any) => void, onError: (err: any) => void): Promise<Unsubscribe>;
    close(): void;
}
export interface SubscriptionClient {
    openConnection(onReconnect: VoidFunction): Promise<SubscriptionClientConnection>;
}
export declare const liveQueryKeepAliveRoute = "_liveQueryKeepAlive";
export declare type LiveQueryChange = {
    type: 'all';
    data: any[];
} | {
    type: 'add';
    data: any;
} | {
    type: 'replace';
    data: {
        oldId: any;
        item: any;
    };
} | {
    type: 'remove';
    data: {
        id: any;
    };
};
/**
 * The `SubscriptionChannel` class is used to send messages from the backend to the frontend,
 * using the same mechanism used by live queries.
 *
 * @template messageType The type of the message that the channel will handle.
 * @example
 * // Defined in code that is shared between the frontend and the backend
 * const statusChange = new SubscriptionChannel<{ oldStatus: number, newStatus: number }>("statusChange");
 *
 * // Backend: Publishing a message
 * statusChange.publish({ oldStatus: 1, newStatus: 2 });
 *
 * // Frontend: Subscribing to messages
 * statusChange.subscribe((message) => {
 *     console.log(`Status changed from ${message.oldStatus} to ${message.newStatus}`);
 * });
 *
 * // Note: If you want to publish from the frontend, use a BackendMethod for that.
 */
export declare class SubscriptionChannel<messageType> {
    channelKey: string;
    /**
     * Constructs a new `SubscriptionChannel` instance.
     *
     * @param {string} channelKey The key that identifies the channel.
     */
    constructor(channelKey: string);
    /**
     * Publishes a message to the channel. This method should only be used on the backend.
     *
     * @param {messageType} message The message to be published.
     * @param {Remult} [remult] An optional instance of Remult to use for publishing the message.
     */
    publish(message: messageType, remult?: Remult): void;
    /**
     * Subscribes to messages from the channel. This method should only be used on the frontend.
     *
     * @param {(message: messageType) => void} next A function that will be called with each message received.
     * @param {Remult} [remult] An optional instance of Remult to use for the subscription.
     * @returns {Promise<Unsubscribe>} A promise that resolves to a function that can be used to unsubscribe from the channel.
     */
    subscribe(next: (message: messageType) => void, remult?: Remult): Promise<Unsubscribe>;
    /**
     * Subscribes to messages from the channel using a `SubscriptionListener` object.
     *
     * @param {Partial<SubscriptionListener<messageType>>} listener An object that implements the `SubscriptionListener` interface.
     * @returns {Promise<Unsubscribe>} A promise that resolves to a function that can be used to unsubscribe from the channel.
     */
    subscribe(listener: Partial<SubscriptionListener<messageType>>): Promise<Unsubscribe>;
}

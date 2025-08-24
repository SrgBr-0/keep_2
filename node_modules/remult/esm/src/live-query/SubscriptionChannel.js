import { v4 as uuid } from 'uuid';
import { Sort } from '../sort.js';
import { remult as defaultRemult } from '../remult-proxy.js';
import { getRepositoryInternals } from '../remult3/repository-internals.js';
export const streamUrl = 'stream';
//@internal
export class LiveQuerySubscriber {
    repo;
    query;
    sendDefaultState(onResult) {
        onResult(this.createReducerType(() => [...this.defaultQueryState], this.allItemsMessage(this.defaultQueryState)));
    }
    queryChannel;
    subscribeCode;
    unsubscribe = () => { };
    async setAllItems(result) {
        const items = await getRepositoryInternals(this.repo)._fromJsonArray(result, this.query.options);
        this.forListeners((listener) => {
            listener(() => {
                return items;
            });
        }, this.allItemsMessage(items));
    }
    allItemsMessage(items) {
        return [
            {
                type: 'all',
                data: items,
            },
        ];
    }
    forListeners(what, changes) {
        what((reducer) => {
            this.defaultQueryState = reducer(this.defaultQueryState);
            if (changes.find((c) => c.type === 'add' || c.type === 'replace')) {
                if (this.query.options.orderBy) {
                    const o = Sort.translateOrderByToSort(this.repo.metadata, this.query.options.orderBy);
                    this.defaultQueryState.sort((a, b) => o.compare(a, b));
                }
            }
        });
        for (const l of this.listeners) {
            what((reducer) => {
                l.next(this.createReducerType(reducer, changes));
            });
        }
    }
    createReducerType(applyChanges, changes) {
        return {
            applyChanges,
            changes,
            items: this.defaultQueryState,
        };
    }
    async handle(messages) {
        {
            let x = messages.filter(({ type }) => type == 'add' || type == 'replace');
            let loadedItems = await getRepositoryInternals(this.repo)._fromJsonArray(x.map((m) => m.data.item), this.query.options);
            for (let index = 0; index < x.length; index++) {
                const element = x[index];
                element.data.item = loadedItems[index];
            }
        }
        this.forListeners((listener) => {
            listener((items) => {
                if (!items)
                    items = [];
                for (const message of messages) {
                    switch (message.type) {
                        case 'all':
                            this.setAllItems(message.data);
                            break;
                        case 'replace': {
                            items = items.map((x) => this.repo.metadata.idMetadata.getId(x) === message.data.oldId
                                ? message.data.item
                                : x);
                            break;
                        }
                        case 'add':
                            items = items.filter((x) => this.repo.metadata.idMetadata.getId(x) !==
                                this.repo.metadata.idMetadata.getId(message.data.item));
                            items.push(message.data.item);
                            break;
                        case 'remove':
                            items = items.filter((x) => this.repo.metadata.idMetadata.getId(x) !== message.data.id);
                            break;
                    }
                }
                return items;
            });
        }, messages);
    }
    defaultQueryState = [];
    listeners = [];
    id = uuid();
    constructor(repo, query, userId) {
        this.repo = repo;
        this.query = query;
        this.queryChannel = `users:${userId}:queries:${this.id}`;
        this.id = this.queryChannel;
    }
}
export const liveQueryKeepAliveRoute = '_liveQueryKeepAlive';
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
export class SubscriptionChannel {
    channelKey;
    /**
     * Constructs a new `SubscriptionChannel` instance.
     *
     * @param {string} channelKey The key that identifies the channel.
     */
    constructor(channelKey) {
        this.channelKey = channelKey;
    }
    /**
     * Publishes a message to the channel. This method should only be used on the backend.
     *
     * @param {messageType} message The message to be published.
     * @param {Remult} [remult] An optional instance of Remult to use for publishing the message.
     */
    publish(message, remult) {
        remult = remult || defaultRemult;
        remult.subscriptionServer.publishMessage(this.channelKey, message);
    }
    //@internal
    subscribe(next, remult) {
        remult = remult || defaultRemult;
        let listener = next;
        if (typeof next === 'function') {
            listener = {
                next,
            };
        }
        listener.error ??= () => { };
        listener.complete ??= () => { };
        return remult.liveQuerySubscriber.subscribeChannel(this.channelKey, listener);
    }
}
//TODO2 - consider moving the queued job mechanism into this.

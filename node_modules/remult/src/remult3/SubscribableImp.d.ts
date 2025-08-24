import type { Unsubscribe } from '../live-query/SubscriptionChannel.js';
import type { Subscribable } from './remult3.js';
export declare class SubscribableImp implements Subscribable {
    reportChanged(): void;
    reportObserved(): void;
    private _subscribers?;
    subscribe(listener: (() => void) | {
        reportChanged: () => void;
        reportObserved: () => void;
    }): Unsubscribe;
}

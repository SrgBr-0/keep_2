export class SubscribableImp {
    reportChanged() {
        if (this._subscribers)
            this._subscribers.forEach((x) => x.reportChanged());
    }
    reportObserved() {
        if (this._subscribers)
            this._subscribers.forEach((x) => x.reportObserved());
    }
    _subscribers;
    subscribe(listener) {
        let list;
        if (typeof listener === 'function')
            list = {
                reportChanged: () => listener(),
                reportObserved: () => { },
            };
        else
            list = listener;
        if (!this._subscribers) {
            this._subscribers = [];
        }
        this._subscribers.push(list);
        return () => (this._subscribers = this._subscribers.filter((x) => x != list));
    }
}

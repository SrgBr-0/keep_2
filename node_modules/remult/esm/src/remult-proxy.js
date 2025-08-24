import { remultStatic } from './remult-static.js';
import { getInternalKey } from './remult3/repository-internals.js';
/*@internal*/
export class RemultProxy {
    /* @internal*/
    iAmRemultProxy = true;
    /* @internal*/
    get liveQuerySubscriber() {
        return remultStatic.remultFactory().liveQuerySubscriber;
    }
    /* @internal*/
    set liveQuerySubscriber(val) {
        remultStatic.remultFactory().liveQuerySubscriber = val;
    }
    /* @internal*/
    get liveQueryStorage() {
        return remultStatic.remultFactory().liveQueryStorage;
    }
    /* @internal*/
    set liveQueryStorage(val) {
        remultStatic.remultFactory().liveQueryStorage = val;
    }
    /* @internal*/
    get liveQueryPublisher() {
        return remultStatic.remultFactory().liveQueryPublisher;
    }
    /* @internal*/
    set liveQueryPublisher(val) {
        remultStatic.remultFactory().liveQueryPublisher = val;
    }
    subscribeAuth(listener) {
        return remultStatic.remultFactory().subscribeAuth(listener);
    }
    initUser() {
        return remultStatic.remultFactory().initUser();
    }
    call(backendMethod, self, ...args) {
        return remultStatic.remultFactory().call(backendMethod, self, ...args);
    }
    get context() {
        return remultStatic.remultFactory().context;
    }
    get dataProvider() {
        return remultStatic.remultFactory().dataProvider;
    }
    set dataProvider(provider) {
        remultStatic.remultFactory().dataProvider = provider;
    }
    /*@internal*/
    get repCache() {
        return remultStatic.remultFactory().repCache;
    }
    authenticated() {
        return remultStatic.remultFactory().authenticated();
    }
    isAllowed(roles) {
        return remultStatic.remultFactory().isAllowed(roles);
    }
    isAllowedForInstance(instance, allowed) {
        return remultStatic.remultFactory().isAllowedForInstance(instance, allowed);
    }
    clearAllCache() {
        return remultStatic.remultFactory().clearAllCache();
    }
    useFetch(args) {
        return remultStatic.remultFactory().useFetch(args);
    }
    repoCache = new Map();
    //@ts-ignore
    repo = (...args) => {
        let self = remultStatic;
        let entityCache = this.repoCache.get(args[0]);
        if (!entityCache) {
            this.repoCache.set(args[0], (entityCache = new Map()));
        }
        let result = entityCache.get(args[1]);
        if (result)
            return result;
        result = {
            get fields() {
                return remultStatic.remultFactory().repo(...args).metadata.fields;
            },
            //@ts-ignore
            [getInternalKey]() {
                return self.remultFactory().repo(...args)[getInternalKey]();
            },
            relations: (args2) => self
                .remultFactory()
                .repo(...args)
                .relations(args2),
            validate: (a, ...b) => self
                .remultFactory()
                .repo(...args)
                //@ts-ignore
                .validate(a, ...b),
            addEventListener: (...args2) => self
                .remultFactory()
                .repo(...args)
                .addEventListener(...args2),
            count: (...args2) => self
                .remultFactory()
                .repo(...args)
                .count(...args2),
            create: (...args2) => self
                .remultFactory()
                .repo(...args)
                .create(...args2),
            delete: (args2) => self
                .remultFactory()
                .repo(...args)
                .delete(args2),
            deleteMany: (args2) => self
                .remultFactory()
                .repo(...args)
                .deleteMany(args2),
            updateMany: (...args2) => self
                .remultFactory()
                .repo(...args)
                .updateMany(...args2),
            find: (...args2) => self
                .remultFactory()
                .repo(...args)
                .find(...args2),
            groupBy: (...args2) => self
                .remultFactory()
                .repo(...args)
                //@ts-ignore
                .groupBy(...args2),
            aggregate: (...args2) => self
                .remultFactory()
                .repo(...args)
                //@ts-ignore
                .aggregate(...args2),
            findFirst: (...args2) => self
                .remultFactory()
                .repo(...args)
                .findFirst(...args2),
            findOne: (...args2) => self
                .remultFactory()
                .repo(...args)
                .findOne(...args2),
            findId: (a, b) => self
                .remultFactory()
                .repo(...args)
                .findId(a, b),
            //@ts-ignore
            toJson: (json) => self
                .remultFactory()
                .repo(...args)
                .toJson(json),
            fromJson: (item, isNew) => self
                .remultFactory()
                .repo(...args)
                .fromJson(item, isNew),
            getEntityRef: (...args2) => self
                .remultFactory()
                .repo(...args)
                .getEntityRef(...args2),
            insert: (args2) => self
                .remultFactory()
                .repo(...args)
                .insert(args2),
            liveQuery: (...args2) => self
                .remultFactory()
                .repo(...args)
                .liveQuery(...args2),
            get metadata() {
                return remultStatic.remultFactory().repo(...args).metadata;
            },
            query: (options) => self
                .remultFactory()
                .repo(...args)
                .query(options),
            save: (args2) => self
                .remultFactory()
                .repo(...args)
                .save(args2),
            upsert: (args2) => self
                .remultFactory()
                .repo(...args)
                .upsert(args2),
            update: (a, b) => self
                .remultFactory()
                .repo(...args)
                .update(a, b),
        };
        entityCache.set(args[1], result);
        return result;
    };
    get user() {
        return remultStatic.remultFactory().user;
    }
    set user(info) {
        remultStatic.remultFactory().user = info;
    }
    get apiClient() {
        return remultStatic.remultFactory().apiClient;
    }
    set apiClient(client) {
        remultStatic.remultFactory().apiClient = client;
    }
    get subscriptionServer() {
        return remultStatic.remultFactory().subscriptionServer;
    }
    set subscriptionServer(value) {
        remultStatic.remultFactory().subscriptionServer = value;
    }
}
export const remult = new RemultProxy();

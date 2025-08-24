import type { idType, Repository } from './remult3/remult3.js';
export declare function makeTitle(name: string): string;
export declare class LookupColumn<T> {
    private repository;
    private isReferenceRelation;
    private allowNull;
    toJson(): any;
    setId(val: any): void;
    waitLoadOf(id: any): Promise<T | undefined> | null;
    get(id: any): any;
    storedItem?: {
        item: T;
    };
    set(item: T): void;
    id?: idType<T>;
    constructor(repository: Repository<T>, isReferenceRelation: boolean, allowNull: boolean);
    get item(): T;
    waitLoad(): Promise<T | null | undefined>;
}

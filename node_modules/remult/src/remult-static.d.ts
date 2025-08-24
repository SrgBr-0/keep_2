import type { ClassType } from '../classType.js';
import type { ClassHelper, Remult, RemultAsyncLocalStorage } from './context.js';
import type { DataProvider } from './data-interfaces.js';
import type { columnInfo } from './remult3/columnInfo.js';
export declare const remultStatic: {
    defaultRemultFactory: () => Remult;
    remultFactory: () => Remult;
    defaultRemult: Remult;
    asyncContext: RemultAsyncLocalStorage;
    columnsOfType: Map<any, columnInfo[]>;
    allEntities: ClassType<any>[];
    classHelpers: Map<any, ClassHelper>;
    actionInfo: {
        allActions: any[];
        runningOnServer: boolean;
        runActionWithoutBlockingUI: <T>(what: () => Promise<T>) => Promise<T>;
        startBusyWithProgress: () => {
            progress: (percent: number) => void;
            close: () => void;
        };
    };
    fieldOptionsEnricher: any;
    captionTransformer: any;
    defaultDataProvider: () => Promise<DataProvider | undefined>;
};
export declare function defaultFactory(): Remult;
export declare function resetFactory(): void;

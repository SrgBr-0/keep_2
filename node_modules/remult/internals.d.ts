export { sqlRelations, sqlRelationsFilter, type SqlRelations, type SqlRelationFilter, } from './src/data-providers/sql-relations.js';
export { getRelationInfo, getRelationFieldInfo, type RelationFieldInfo, type RelationInfo, type RelationFields, } from './src/remult3/relationInfoMember.js';
export { decorateColumnSettings, controllerRefImpl, getControllerRef, fieldOptionsEnricher, } from './src/remult3/RepositoryImplementation.js';
export { getEntitySettings } from './src/remult3/getEntityRef.js';
export { __updateEntityBasedOnWhere } from './src/filter/filter-interfaces.js';
export declare const actionInfo: {
    allActions: any[];
    runningOnServer: boolean;
    runActionWithoutBlockingUI: <T>(what: () => Promise<T>) => Promise<T>;
    startBusyWithProgress: () => {
        progress: (percent: number) => void;
        close: () => void;
    };
};
export type { ClassType } from './classType.js';
export { flags } from './src/remult3/remult3.js';

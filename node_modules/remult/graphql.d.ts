import type { ClassType } from './classType.js';
import { Remult } from './index.js';
export declare function remultGraphql(options: {
    removeComments?: boolean;
    entities: ClassType<any>[];
    getRemultFromRequest?: (req: any) => Promise<Remult>;
}): {
    resolvers: {
        Query: Record<string, unknown>;
        Mutation: Record<string, unknown>;
    };
    rootValue: Record<string, any>;
    typeDefs: string;
};

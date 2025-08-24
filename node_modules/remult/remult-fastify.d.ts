import type { FastifyPluginCallback, FastifyRequest } from 'fastify';
import type { RemultServerCore, RemultServerOptions, RemultServer } from './server/remult-api-server.js';
export declare function remultFastify(options: RemultServerOptions<FastifyRequest>): RemultFastifyServer;
export type RemultFastifyServer = FastifyPluginCallback & RemultServerCore<FastifyRequest> & {
    withRemult: RemultServer<FastifyRequest>['withRemultAsync'];
};

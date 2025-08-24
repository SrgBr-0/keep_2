import * as express from 'express';
import type { RemultServer, RemultServerCore, RemultServerOptions } from './server/remult-api-server.js';
export declare function remultExpress(options?: RemultServerOptions<express.Request> & {
    bodyParser?: boolean;
    bodySizeLimit?: string;
}): RemultExpressServer;
export type RemultExpressServer = express.RequestHandler & RemultServerCore<express.Request> & {
    withRemult: (req: express.Request, res: express.Response, next: VoidFunction) => void;
} & Pick<RemultServer<express.Request>, 'withRemultAsync'>;

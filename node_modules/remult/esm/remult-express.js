import * as express from 'express';
import { createRemultServer } from './server/index.js';
export function remultExpress(options) {
    let app = express.Router();
    if (!options) {
        options = {};
    }
    if (options.bodySizeLimit === undefined) {
        options.bodySizeLimit = '10mb';
    }
    if (options?.bodyParser !== false) {
        app.use(express.json({ limit: options.bodySizeLimit }));
        app.use(express.urlencoded({ extended: true, limit: options.bodySizeLimit }));
    }
    const server = createRemultServer(options, {
        buildGenericRequestInfo: (req) => req,
        getRequestBody: async (req) => req.body,
    });
    server.registerRouter(app);
    return Object.assign(app, {
        getRemult: (req) => server.getRemult(req),
        openApiDoc: (options) => server.openApiDoc(options),
        withRemult: (req, res, next) => server.withRemult(req, res, next),
        withRemultAsync: (req, what) => server.withRemultAsync(req, what),
    });
}

import { readBody, setResponseStatus } from 'h3';
import { createRemultServer } from './server/index.js';
export function remultNuxt(options) {
    const result = createRemultServer(options, {
        buildGenericRequestInfo: (event) => {
            return {
                method: event.node.req.method,
                url: event.node.req.url,
                on: (a, b) => event.node.req.on('close', () => {
                    b();
                }),
            };
        },
        getRequestBody: async (event) => await readBody(event),
    });
    const handler = async (event) => {
        let sse = false;
        const response = {
            end: () => { },
            send: () => { },
            json: () => { },
            status: () => {
                return response;
            },
            write: (what) => {
                event.node.res.write(what);
            },
            writeHead: (status, headers) => {
                sse = true;
                event.node.res.writeHead(status, headers);
            },
        };
        const r = await result.handle(event, response);
        if (sse) {
            await new Promise((resolve) => {
                event.node.req.on('close', () => resolve({}));
            });
        }
        if (r) {
            if (r.statusCode !== 200)
                setResponseStatus(event, r.statusCode);
            if (r.html)
                return r.html;
            return r.data == null ? 'null' : r.data;
        }
    };
    return Object.assign(handler, {
        getRemult: (req) => result.getRemult(req),
        openApiDoc: (options) => result.openApiDoc(options),
        withRemult(request, what) {
            return result.withRemultAsync(request, what);
        },
    });
}

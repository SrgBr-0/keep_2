import { Hono } from 'hono';
import { streamSSE } from 'hono/streaming';
import { createRemultServer, } from './server/index.js';
export function remultHono(options) {
    let app = new Hono();
    const api = createRemultServer(options, {
        buildGenericRequestInfo: (c) => {
            return {
                method: c.req.method,
                params: c.req.param(),
                query: new Proxy(c.req, {
                    get: (target, prop) => {
                        const r = c.req.queries(prop);
                        if (r?.length == 1)
                            return r[0];
                        return r;
                    },
                }),
                url: c.req.url,
                on: (e, do1) => {
                    ;
                    c['_tempOnClose'](() => do1());
                    //   c.req.on('close', do1)
                },
            };
        },
        getRequestBody: async (c) => {
            return c.req.json();
        },
    });
    let honoRouter = {
        route(path) {
            let r = {
                get(handler) {
                    app.get(path, honoHandler(handler));
                    return r;
                },
                post(handler) {
                    app.post(path, honoHandler(handler));
                    return r;
                },
                put(handler) {
                    app.put(path, honoHandler(handler));
                    return r;
                },
                delete(handler) {
                    app.delete(path, honoHandler(handler));
                    return r;
                },
            };
            return r;
            function honoHandler(handler) {
                return (c) => {
                    return new Promise((res, rej) => {
                        try {
                            let result;
                            let sse;
                            const gRes = {
                                json: (data) => {
                                    res(c.json(data));
                                },
                                status: (status) => {
                                    result = c.status(status);
                                    return gRes;
                                },
                                end: () => {
                                    if (sse)
                                        sse.close();
                                    else
                                        res(c.body(null));
                                },
                                send: (data) => {
                                    res(c.html(data));
                                },
                                write: (data) => {
                                    sse.write(data);
                                },
                                writeHead: (status, headers) => {
                                    res(streamSSE(c, (s) => {
                                        sse = s;
                                        return new Promise((res) => {
                                            ;
                                            c['_tempOnClose'] = (x) => sse.onAbort(() => x());
                                        });
                                    }));
                                },
                            };
                            handler(c, gRes, () => { });
                        }
                        catch (err) {
                            rej(err);
                        }
                    });
                };
            }
        },
    };
    api.registerRouter(honoRouter);
    return Object.assign(app, {
        getRemult: (c) => api.getRemult(c),
        openApiDoc: (options) => api.openApiDoc(options),
        withRemult: async (c, what) => api.withRemultAsync(c, what),
    });
}

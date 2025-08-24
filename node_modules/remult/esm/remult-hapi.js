import { createRemultServer, } from './server/index.js';
import { PassThrough } from 'stream';
export function remultHapi(options) {
    const api = createRemultServer(options, {
        buildGenericRequestInfo: (req) => ({
            method: req.method,
            params: req.params,
            query: req.query,
            url: req.url.pathname,
            on: (e, do1) => {
                req.raw.req.on('close', do1);
            },
        }),
        getRequestBody: async (req) => req.payload,
    });
    const routesPlugin = {
        name: 'remultPlugin',
        register: async (server) => {
            function hapiHandler(handler) {
                return (request, h) => {
                    return new Promise((res, rej) => {
                        let status = 200;
                        let stream;
                        let r = {
                            status(statusCode) {
                                status = statusCode;
                                return r;
                            },
                            end() {
                                res(h.response().code(status));
                            },
                            send(html) {
                                res(h.response(html).code(status));
                            },
                            json(data) {
                                res(h.response(data === null ? 'null' : data).code(status));
                            },
                            write(data) {
                                stream.write(data);
                            },
                            writeHead(status, headers) {
                                stream = new PassThrough();
                                res(h
                                    .response(stream)
                                    .header('content-type', 'text/event-stream')
                                    .header('content-encoding', 'identity'));
                            },
                        };
                        try {
                            Object.assign(request, {
                                on(event, listener) {
                                    request.raw.req.on('close', () => {
                                        listener();
                                        console.log('Connection closed');
                                    });
                                },
                            });
                            handler(request, r, () => { });
                        }
                        catch (err) {
                            rej(err);
                        }
                    });
                };
            }
            let hapiRouter = {
                route(path) {
                    path = path.replace(/:id\b/g, '{id}');
                    let r = {
                        get(handler) {
                            server.route({
                                method: 'GET',
                                path,
                                handler: hapiHandler(handler),
                            });
                            return r;
                        },
                        post(handler) {
                            server.route({
                                method: 'POST',
                                path,
                                handler: hapiHandler(handler),
                            });
                            return r;
                        },
                        put(handler) {
                            server.route({
                                method: 'PUT',
                                path,
                                handler: hapiHandler(handler),
                            });
                            return r;
                        },
                        delete(handler) {
                            server.route({
                                method: 'DELETE',
                                path,
                                handler: hapiHandler(handler),
                            });
                            return r;
                        },
                    };
                    return r;
                },
            };
            api.registerRouter(hapiRouter);
        },
    };
    return Object.assign(routesPlugin, {
        getRemult: (x) => api.getRemult(x),
        openApiDoc: (x) => api.openApiDoc(x),
        withRemult: (req, what) => api.withRemultAsync(req, what),
    });
}

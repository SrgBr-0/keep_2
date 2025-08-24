import { createRemultServer } from './server/index.js';
export function remultFastify(options) {
    function fastifyHandler(handler) {
        const response = (req, res) => {
            const myRes = {
                status(statusCode) {
                    res.status(statusCode);
                    return myRes;
                },
                end() {
                    res.send();
                },
                send(html) {
                    res.type('text/html').send(html);
                },
                json(data) {
                    res.send(data);
                },
                write(data) {
                    res.raw.write(data);
                },
                writeHead(status, headers) {
                    res.raw.writeHead(status, headers);
                },
            };
            Object.assign(req, {
                on(event, listener) {
                    req.raw.on(event, listener);
                },
            });
            handler(req, myRes, () => { });
        };
        return response;
    }
    const api = createRemultServer(options, {
        buildGenericRequestInfo: (req) => req,
        getRequestBody: async (req) => req.body,
    });
    const pluginFunction = async (instance, op) => {
        //@ts-ignore
        let fastifyRouter = {
            route(path) {
                let r = {
                    delete(handler) {
                        instance.delete(path, fastifyHandler(handler));
                        return r;
                    },
                    get(handler) {
                        instance.get(path, fastifyHandler(handler));
                        return r;
                    },
                    post(handler) {
                        instance.post(path, fastifyHandler(handler));
                        return r;
                    },
                    put(handler) {
                        instance.put(path, fastifyHandler(handler));
                        return r;
                    },
                };
                return r;
            },
        };
        api.registerRouter(fastifyRouter);
    };
    return Object.assign(pluginFunction, {
        getRemult: (x) => api.getRemult(x),
        openApiDoc: (x) => api.openApiDoc(x),
        withRemult: (req, what) => api.withRemultAsync(req, what),
    });
}

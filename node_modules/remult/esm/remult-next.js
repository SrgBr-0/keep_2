import { createRemultServer } from './server/index.js';
export function remultNext(options) {
    let result = createRemultServer(options, {
        buildGenericRequestInfo: (req) => req,
        getRequestBody: async (req) => req.body,
    });
    return Object.assign((req, res) => result.handle(req, res).then(() => { }), result, {
        getRemult: (req) => result.getRemult(req),
        openApiDoc: (arg) => result.openApiDoc(arg),
        withRemult: (req, what) => result.withRemultAsync(req, what),
    }, {
        getServerSideProps: (getServerPropsFunction) => {
            return (context) => {
                return new Promise((res, err) => {
                    result.withRemult(context, undefined, async () => {
                        try {
                            let r = await getServerPropsFunction(context);
                            res(JSON.parse(JSON.stringify(r)));
                        }
                        catch (e) {
                            err(e);
                        }
                    });
                });
            };
        },
        handle: (handler) => {
            return async (req, res) => {
                await new Promise(async (resolve) => {
                    result.withRemult(req, res, async () => {
                        await handler(req, res);
                        resolve();
                    });
                });
            };
        },
    });
}
const encoder = new TextEncoder();
export function remultNextApp(options) {
    let result = createRemultServer(options, {
        getRequestBody: (req) => req.json(),
        buildGenericRequestInfo: (req) => ({
            url: req?.url,
            method: req?.method,
            on: (e, do1) => {
                if (e === 'close') {
                    ;
                    req['_tempOnClose'] = do1;
                }
            },
        }),
    });
    const handler = async (req) => {
        {
            let sseResponse = undefined;
            req['_tempOnClose'] = () => { };
            const response = {
                end: () => { },
                json: () => { },
                send: () => { },
                status: () => {
                    return response;
                },
                write: () => { },
                writeHead: (status, headers) => {
                    if (status === 200 && headers) {
                        const contentType = headers['Content-Type'];
                        if (contentType === 'text/event-stream') {
                            const messages = [];
                            response.write = (x) => messages.push(x);
                            const stream = new ReadableStream({
                                start: (controller) => {
                                    for (const message of messages) {
                                        controller.enqueue(encoder.encode(message));
                                    }
                                    response.write = (data) => {
                                        controller.enqueue(encoder.encode(data));
                                    };
                                },
                                cancel: () => {
                                    response.write = () => { };
                                    req['_tempOnClose']();
                                },
                            });
                            sseResponse = new Response(stream, { headers });
                        }
                    }
                },
            };
            const responseFromRemultHandler = await result.handle(req, response);
            if (sseResponse !== undefined) {
                return sseResponse;
            }
            if (responseFromRemultHandler) {
                if (responseFromRemultHandler.html)
                    return new Response(responseFromRemultHandler.html, {
                        status: responseFromRemultHandler.statusCode,
                        headers: {
                            'Content-Type': 'text/html',
                        },
                    });
                return new Response(JSON.stringify(responseFromRemultHandler.data), {
                    status: responseFromRemultHandler.statusCode,
                });
            }
            if (!responseFromRemultHandler) {
                return new Response('', {
                    status: 404,
                });
            }
        }
    };
    return {
        getRemult: (req) => result.getRemult(req),
        openApiDoc: (options) => result.openApiDoc(options),
        GET: handler,
        POST: handler,
        PUT: handler,
        DELETE: handler,
        withRemult: (what) => result.withRemultAsync({}, what),
    };
}

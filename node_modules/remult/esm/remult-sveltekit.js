import { createRemultServer } from './server/index.js';
export function remultSveltekit(options) {
    let result = createRemultServer(options, {
        buildGenericRequestInfo: (event) => ({
            url: event.request.url,
            method: event.request.method,
            on: (e, do1) => {
                if (e === 'close') {
                    ;
                    event.locals['_tempOnClose'] = do1;
                }
            },
        }),
        getRequestBody: (event) => event.request.json(),
    });
    const serverHandler = async (event) => {
        let sseResponse = undefined;
        event.locals['_tempOnClose'] = () => { };
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
                                    controller.enqueue(message);
                                }
                                response.write = (data) => {
                                    controller.enqueue(data);
                                };
                            },
                            cancel: () => {
                                response.write = () => { };
                                event.locals['_tempOnClose']();
                            },
                        });
                        sseResponse = new Response(stream, { headers });
                    }
                }
            },
        };
        const responseFromRemultHandler = await result.handle(event, response);
        if (sseResponse !== undefined) {
            return sseResponse;
        }
        if (responseFromRemultHandler !== undefined) {
            if (responseFromRemultHandler.html)
                return new Response(responseFromRemultHandler.html, {
                    status: responseFromRemultHandler.statusCode,
                    headers: {
                        'Content-Type': 'text/html',
                    },
                });
            const res = new Response(JSON.stringify(responseFromRemultHandler.data), {
                status: responseFromRemultHandler.statusCode,
            });
            return res;
        }
        return new Response('Not Found', {
            status: 404,
        });
    };
    const handler = async ({ event, resolve }) => {
        return result.withRemultAsync(event, async () => await resolve(event));
    };
    return Object.assign(handler, {
        getRemult: (req) => result.getRemult(req),
        openApiDoc: (options) => result.openApiDoc(options),
        withRemult(request, what) {
            return result.withRemultAsync(request, what);
        },
        hookHandler: handler,
        GET: serverHandler,
        PUT: serverHandler,
        POST: serverHandler,
        DELETE: serverHandler,
    });
}

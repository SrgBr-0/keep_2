import { getRequestEvent } from 'solid-js/web';
import { createRemultServer } from './server/index.js';
export function remultSolidStart(options) {
    let result = createRemultServer(options, {
        buildGenericRequestInfo: (event) => ({
            url: event.request.url,
            method: event.request.method,
            on: (e, do1) => {
                if (e === 'close') {
                    event.locals['_tempOnClose'] = do1;
                }
            },
        }),
        getRequestBody: (event) => event.request.json(),
    });
    const serverHandler = async () => {
        const event = await getRequestEvent();
        let sseResponse = undefined;
        if (event)
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
                                event?.locals?.['_tempOnClose']?.();
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
        if (responseFromRemultHandler) {
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
    const handler = {}; //async ({ event, resolve }) => {
    //   if (event.url.pathname.startsWith(options!.rootPath!)) {
    //     const result = await serverHandler(event)
    //     if (result != null && result?.status != 404) return result
    //   }
    //   return new Promise<Response>((res) => {
    //     result.withRemult(event, undefined!, async () => {
    //       res(await resolve(event))
    //     })
    //   })
    // }
    return Object.assign(handler, {
        getRemult: (req) => result.getRemult(req),
        openApiDoc: (options) => result.openApiDoc(options),
        async withRemult(what) {
            return result.withRemultAsync(await getRequestEvent(), what);
        },
        GET: serverHandler,
        PUT: serverHandler,
        POST: serverHandler,
        DELETE: serverHandler,
    });
}

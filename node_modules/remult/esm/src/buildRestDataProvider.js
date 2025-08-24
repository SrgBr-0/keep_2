import { RestDataProviderHttpProviderUsingFetch } from './data-providers/rest-data-provider.js';
import { flags } from './remult3/remult3.js';
export function buildRestDataProvider(provider) {
    if (!provider)
        return new RestDataProviderHttpProviderUsingFetch();
    let httpDataProvider;
    if (!httpDataProvider) {
        if (isExternalHttpProvider(provider)) {
            httpDataProvider = new HttpProviderBridgeToRestDataProviderHttpProvider(provider);
        }
    }
    if (!httpDataProvider) {
        if (typeof provider === 'function') {
            httpDataProvider = new RestDataProviderHttpProviderUsingFetch(provider);
        }
    }
    return httpDataProvider;
}
export function isExternalHttpProvider(item) {
    let http = item;
    if (http && http.get && http.put && http.post && http.delete)
        return true;
    return false;
}
export class HttpProviderBridgeToRestDataProviderHttpProvider {
    http;
    constructor(http) {
        this.http = http;
    }
    async post(url, data) {
        return await retry(() => toPromise(this.http.post(url, data)));
    }
    delete(url) {
        return toPromise(this.http.delete(url));
    }
    put(url, data) {
        return toPromise(this.http.put(url, data));
    }
    async get(url) {
        return await retry(() => toPromise(this.http.get(url)));
    }
}
export async function retry(what) {
    let i = 0;
    while (true) {
        try {
            return await what();
        }
        catch (err) {
            if ((err.message?.startsWith('Error occurred while trying to proxy') ||
                err.message?.startsWith('Error occured while trying to proxy') ||
                err.message?.includes('http proxy error') ||
                err.message?.startsWith('Gateway Timeout') ||
                err.status == 500) &&
                i++ < flags.error500RetryCount) {
                await new Promise((res, req) => {
                    setTimeout(() => {
                        res({});
                    }, 500);
                });
                continue;
            }
            throw err;
        }
    }
}
export function toPromise(p) {
    let r;
    if (p['toPromise'] !== undefined) {
        r = p['toPromise']();
    }
    //@ts-ignore
    else
        r = p;
    return r
        .then((x) => {
        if (x &&
            (x.status == 200 || x.status == 201) &&
            x.headers &&
            x.request &&
            x.data !== undefined)
            //for axios
            return x.data;
        return x;
    })
        .catch(async (ex) => {
        throw await processHttpException(ex);
    });
}
export async function processHttpException(ex) {
    let z = await ex;
    var error;
    if (z.error)
        error = z.error;
    else if (z.isAxiosError) {
        if (typeof z.response?.data === 'string')
            error = z.response.data;
        else
            error = z?.response?.data;
    }
    if (!error)
        error = z.message;
    if (z.status == 0 && z.error.isTrusted)
        error = 'Network Error';
    if (typeof error === 'string') {
        error = {
            message: error,
        };
    }
    if (z.modelState)
        error.modelState = z.modelState;
    let httpStatusCode = z.status;
    if (httpStatusCode === undefined)
        httpStatusCode = z.response?.status;
    if (httpStatusCode !== undefined && httpStatusCode !== null) {
        error.httpStatusCode = httpStatusCode;
    }
    var result = Object.assign(error ?? {}, {
    //     exception: ex disabled for now because JSON.stringify crashed with this
    });
    return result;
}

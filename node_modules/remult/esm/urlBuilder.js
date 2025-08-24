export class UrlBuilder {
    url;
    constructor(url) {
        this.url = url;
    }
    add(key, value) {
        if (this.url.indexOf('?') >= 0)
            this.url += '&';
        else
            this.url += '?';
        this.url += encodeURIComponent(key) + '=' + encodeURIComponent(value);
    }
    addObject(object, suffix = '') {
        if (object != undefined)
            for (var key in object) {
                let val = object[key];
                this.add(key + suffix, val);
            }
    }
}

import memoize from 'lodash/memoize';

const absoluteUrl = /^https?:\/\//i;

const joinUrls = (base, url) =>
    (base.endsWith('/') ? base.slice(0, -1) : base) +
    '/' +
    (url.startsWith('/') ? url.slice(1) : url);

const mediaPathPrefixes = {
    product: '/media/catalog/product/',
    category: '/media/catalog/category'
};

function makeResizedUrl(url, width) {
    return joinUrls(`/resize/${width}w`, url);
}

function makeMediaUrl(url, opts = {}) {
    const { type, width } = opts;
    if (absoluteUrl.test(url) || !(type || width)) {
        return url;
    }
    let finalUrl = url;
    if (type) {
        if (!mediaPathPrefixes.hasOwnProperty(type)) {
            throw new Error(`Unrecognized media type ${type}`);
        }
        finalUrl = joinUrls(mediaPathPrefixes[type], url);
    }
    return width ? makeResizedUrl(finalUrl, width) : finalUrl;
}

const storeUrlKey = (url, { width = '', type = '' } = {}) =>
    `${type}%%${url}%%${width}`;

export default memoize(makeMediaUrl, storeUrlKey);

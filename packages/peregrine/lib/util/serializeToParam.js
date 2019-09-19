/**
 * A utility function to seralize filters to query params.
 *
 * @example
 *
 * serializeToParam({
 *   "fashion_color": [{
 *     "title": "Gold",
 *     "value": 14
 *   }]
 * }) // outputs &fashion_color[title]=Gold&fashion_color[value]=14
 *
 * @param {Object} params   a map of filters to an object with title and value
 * @param {Array} keys      keys for filter properties
 */
const serializeToParam = (params, keys = []) => {
    const isArray = Array.isArray(params);
    const serialized = Object.keys(params)
        .map(key => {
            const val = params[key];
            const isObject =
                Object.prototype.toString.call(val) === '[object Object]';
            if (isObject || Array.isArray(val)) {
                if (val.length === 0) return null;
                keys.push(Array.isArray(params) ? '' : key);
                return serializeToParam(val, keys);
            } else {
                let tKey = key;

                if (keys.length > 0) {
                    const tKeys = isArray
                        ? keys.filter(v => v != '')
                        : [...keys, key].filter(v => v != '');
                    tKey = tKeys.reduce((str, k) => {
                        return '' === str ? k : `${str}[${k}]`;
                    }, '');
                }

                return isArray ? `${tKey}[]=${val}` : `${tKey}=${val}`;
            }
        })
        .filter(Boolean)
        .join('&');

    keys.pop();
    return serialized;
};

export default serializeToParam;

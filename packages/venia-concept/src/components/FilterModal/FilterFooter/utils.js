export const serialize = (params, keys = [], isArray = false) => {
    const p = Object.keys(params)
        .map(key => {
            let val = params[key];

            if (
                '[object Object]' === Object.prototype.toString.call(val) ||
                Array.isArray(val)
            ) {
                if (Array.isArray(params)) {
                    keys.push('');
                } else {
                    keys.push(key);
                }
                return serialize(val, keys, Array.isArray(val));
            } else {
                let tKey = key;

                if (keys.length > 0) {
                    const tKeys = isArray ? keys : [...keys, key];
                    tKey = tKeys.reduce((str, k) => {
                        return '' === str ? k : `${str}[${k}]`;
                    }, '');
                }
                if (isArray) {
                    return `${tKey}[]=${val}`;
                } else {
                    return `${tKey}=${val}`;
                }
            }
        })
        .join('&');

    keys.pop();
    return p;
};

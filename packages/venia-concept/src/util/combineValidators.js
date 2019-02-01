/**
 * @fileoverview This file houses function that groups multiple validators into
 * a single callback
 */

export default callbacks => {
    if (callbacks == null || !callbacks[Symbol.iterator]) {
        throw new Error('Expected `callbacks` to be iterable.');
    }

    return (value, values) => {
        let result = null;

        for (let i = 0; i < callbacks.length; i++) {
            let callback = callbacks[i];

            if (callback == null || (!callback[Symbol.iterator] && typeof callback !== 'function')) {
                throw new Error('Expected `callbacks[' + i + ']` to be iterable or function.');
            }

            if (callback[Symbol.iterator]) {
                let extendedCallback = callback[0];
                let extendedParam = callback[1];

                if (typeof extendedCallback !== 'function') {
                    throw new Error('Expected `callbacks[' + i + '][0]` to be function.');
                }

                result = extendedCallback(value, values, extendedParam);
            } else {
                result = callback(value, values);
            }

            if (result) {
                break;
            }
        }

        return result;
    };
};

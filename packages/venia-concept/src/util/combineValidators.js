/**
 * The function purpose is to group validation callbacks into a chain within single callback function.
 *
 * The single callback function should be passed as `validation` prop to an input component. It's being
 * called by the React Controller on a form submit.
 * The `callbacks` param is the array contains validators. Each validator should be either function or array. In case of a
 * validator is a function it is called the same way as React Controller does, with a field `value` and a form `values` params. If
 * the validator is an array, this means that it is extended validator which requires additional param for configuration.
 * The first index of that array should be a extended validator function, the second index is extended param, which is needed for
 * that function. So the function is called with three params on the form submit, with a field `value`, a form `values`
 * and an `extended param`.
 *
 * Example usage of the function:
 *
 * <input validate={combine([
 * foo
 * ])} .../>
 *
 * foo - validation function
 * It will be called on form submitting within chain as:
 * `foo(value, values)`
 *
 * Example usage of the function with extended callback:
 *
 * <input validate={combine([
 * [foo, bar]
 * ])} .../>
 *
 * foo - extended validator
 * bar - additional param
 * It will be called on form submitting within chain as:
 * `foo(value, values, bar)`
 *
 * Each callback being called one after another, according to their index in callbacks array, if one item returned the error
 * message, validation is failed, and rest validator are not supposed to be called.
 *
 * @param {Array} callbacks
 * @return {function(value, values): *}
 */
export default callbacks => {
    if (callbacks == null || !Array.isArray(callbacks)) {
        throw new Error('Expected `callbacks` to be array.');
    }

    return (value, values) => {
        let result = null;

        for (let i = 0; i < callbacks.length; i++) {
            const callback = callbacks[i];

            if (
                callback == null ||
                (!Array.isArray(callback) && typeof callback !== 'function')
            ) {
                throw new Error(
                    'Expected `callbacks[' + i + ']` to be array or function.'
                );
            }

            if (Array.isArray(callback)) {
                const [extendedCallback, extendedParam] = callback;

                if (typeof extendedCallback !== 'function') {
                    throw new Error(
                        'Expected `callbacks[' + i + '][0]` to be function.'
                    );
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

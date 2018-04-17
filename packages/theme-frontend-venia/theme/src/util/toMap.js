/**
 * Create a `Map` from an iterable object.
 *
 * The second parameter, `transform`, is used to derive the key for each element.
 * If the elements are key-value pairs, use the `Map` constructor instead.
 *
 * @param {iterable} elements
 * @param {function} transform
 * @returns {Map}
 */
const toMap = (elements, transform = v => v) => {
    if (elements == null || !elements[Symbol.iterator]) {
        throw new Error('Expected `elements` to be iterable.');
    }

    if (typeof transform !== 'function') {
        throw new Error('Expected `transform` to be a function.');
    }

    const map = new Map();
    let index = 0;

    for (const element of elements) {
        const pair = transform(element, index);
        const isArray = Array.isArray(pair);
        const isPair = pair.length === 2;

        if (!isArray || !isPair) {
            throw new Error('Expected `transform` to return key-value pairs.');
        }

        map.set(...pair);
        index++;
    }

    return map;
};

export default toMap;

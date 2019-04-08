/**
 * Returns whether the given object is empty ({}).
 * @see https://stackoverflow.com/a/32108184.
 *
 * @param {Object} obj - the object under test.
 */
export default function isObjectEmpty(obj) {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
}

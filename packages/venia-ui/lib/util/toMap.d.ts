export default toMap;
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
declare function toMap(elements: any, transform?: Function): Map<any, any>;

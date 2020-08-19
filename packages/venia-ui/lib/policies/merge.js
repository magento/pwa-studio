/**
 * Merge function helpers for type policy merges.
 * @link https://www.apollographql.com/docs/react/caching/cache-field-behavior/#merging-arrays-of-non-normalized-objects
 */

/**
 * Always merges incoming values into existing values, creating new
 * entries when there is not a found existing entity.
 *
 * @param {Array} existing
 * @param {Array} incoming
 * @param {Function} options.mergeObjects
 * @param {Function} calculateId - used to get id ie `entity => entity.code`.
 */
export const mergeIntoExisting = (
    existing = [],
    incoming,
    options,
    calculateId
) => {
    const merged = existing ? existing.slice(0) : [];
    // For each existing entity, heuristically create an `id`
    // and use it to store the index of the entity
    const idToIndex = Object.create(null);
    existing.forEach((entity, index) => {
        const id = calculateId ? calculateId(entity) : index;
        idToIndex[id] = index;
    });
    incoming.forEach((entity, idx) => {
        const id = calculateId ? calculateId(entity) : idx;
        const index = idToIndex[id];
        if (typeof index === 'number') {
            // Merge the new entity data with the existing entity data.
            merged[index] = options.mergeObjects(merged[index], entity);
        } else {
            // First time we've seen this entity in this array.
            idToIndex[id] = merged.length;
            merged.push(entity);
        }
    });
    return merged;
};

/**
 * Always merges into incoming, ignoring any existing entity that
 * does not exist in the incoming.
 *
 * @param {Array} existing
 * @param {Array} incoming
 * @param {Function} options.mergeObjects
 * @param {Function} calculateId - used to get id ie `entity => entity.code`.
 */
export const mergeIntoIncoming = (
    existing = [],
    incoming,
    options,
    calculateId
) => {
    const merged = incoming ? incoming.slice(0) : [];
    const idToIndex = {};
    incoming.forEach((entity, index) => {
        const id = calculateId ? calculateId(entity) : index;
        idToIndex[id] = index;
    });

    existing.forEach((entity, idx) => {
        const id = calculateId ? calculateId(entity) : idx;
        const index = idToIndex[id];

        if (typeof index === 'number') {
            // Merge the new entity data with the existing entity data.
            merged[index] = options.mergeObjects(merged[index], entity);
        }
    });

    return merged;
};

/**
 * Conditionally merges based on lengths of existing and incoming arrays.
 *
 * @param {Array} existing
 * @param {Array} incoming
 * @param {Function} options.mergeObjects
 * @param {Function} calculateId - used to get id ie `entity => entity.code`.
 */
export const mergeConditionally = (
    existing = [],
    incoming,
    options,
    calculateId
) => {
    // If adding or modifying, merge INTO existing.
    if (incoming.length >= existing.length) {
        return mergeIntoExisting(existing, incoming, options, calculateId);
    } else {
        // When removing, merge INTO incoming.
        return mergeIntoIncoming(existing, incoming, options, calculateId);
    }
};

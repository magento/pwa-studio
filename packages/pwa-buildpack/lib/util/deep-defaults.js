/**
 * Simple two-level shallow merge.
 * - Only works with objects.
 * - Deep merges any second-level objects.
 * - Overwrites everything else.
 */

module.exports = (source, defaults) => {
    const target = {};
    Object.assign(target, source);

    // one extra layer of merge depth
    for (const [section, defaultValue] of Object.entries(defaults)) {
        if (!source.hasOwnProperty(section)) {
            target[section] = defaultValue;
        } else if (
            typeof source[section] === 'object' &&
            typeof defaultValue === 'object'
        ) {
            target[section] = Object.assign({}, defaultValue, source[section]);
        }
    }
    return target;
};

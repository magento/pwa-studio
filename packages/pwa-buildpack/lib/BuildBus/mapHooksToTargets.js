/**
 * Mapping Tapable hooks to the Buildpack facade of Targets.
 * @module Buildpack/BuildBus
 */
const Tapable = require('tapable');

/**
 * The names of Tapable hooks, but without "Hook" on the end.
 * We hide the "Hook" name a little bit because its name overlaps
 * with React Hooks in a confusing way.
 * @private
 */
const allowedTargetTypes = [
    'Sync',
    'SyncBail',
    'SyncWaterfall',
    'SyncLoop',
    'AsyncParallel',
    'AsyncParallelBail',
    'AsyncSeries',
    'AsyncSeriesBail',
    'AsyncSeriesWaterfall'
];

/**
 * Map of Tapable hook classes to the 'Hook'-free target names in
 * `allowedTargetTypes`
 * @private
 */
const VALID_TYPES = new Map();

/**
 * Dictionary of Tapable Hook classes to expose under these new names.
 * @public
 * @type {Object.<string,Tapable.Hook>}
 */
const types = {};

// Populate the validator map and type dictionary
for (const type of allowedTargetTypes) {
    const HookConstructor = Tapable[type + 'Hook'];
    types[type] = HookConstructor;
    VALID_TYPES.set(HookConstructor, type);
}

/**
 * Duck typing for async hooks
 * @private
 */
const hasAsyncHookInterface = hook =>
    typeof hook.tapAsync === 'function' &&
    typeof hook.tapPromise === 'function' &&
    typeof hook.callAsync === 'function' &&
    typeof hook.promise === 'function';

/**
 * Duck typing for sync hooks
 * @private
 */
const hasSyncHookInterface = hook =>
    typeof hook.tap === 'function' && typeof hook.call === 'function';

/**
 * Use duck typing to validate that the passed object seems like a Tapable hook.
 * More robust than doing `instanceof` checks; allows hooks to be proxied and
 * otherwise hacked by dependencies.
 * @public
 * @param {object} thing - Is it hook-ish?
 * @returns {boolean}
 */
const appearsToBeTapable = thing =>
    thing &&
    typeof thing === 'object' &&
    typeof thing.intercept === 'function' &&
    (hasSyncHookInterface(thing) || hasAsyncHookInterface(thing));

/**
 * Get the string type name of a provided object. If it is one of the base
 * Tapable Hooks supported, returns the name of that Hook (without 'Hook' on
 * the end). Otherwise, returns '<unknown>'.
 * @public
 */
const getTapableType = hook => VALID_TYPES.get(hook.constructor) || '<unknown>';

module.exports = {
    appearsToBeTapable,
    getTapableType,
    types
};

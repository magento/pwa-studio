export default bindActionCreatorsRecursively;
export type CreatorObject = {
    [key: string]: Function | any;
};
/**
 * Maps an object whose values are action creators (or objects of such)
 * into an object whose values are bound action creators (or objects of such).
 *
 * A bound action creator is one wrapped into a `dispatch` call,
 * such that invoking it creates and dispatches an action.
 *
 * Note that `actions` may not be a function.
 *
 * @param {CreatorObject} actions - A nested object containing action creators.
 * @param {Function} dispatch - The `dispatch` function from a Redux store.
 * @return {CreatorObject} - A nested object containing bound action creators.
 */
declare function bindActionCreatorsRecursively(actions: CreatorObject, dispatch: Function): CreatorObject;

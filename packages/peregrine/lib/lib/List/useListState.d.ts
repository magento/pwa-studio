/**
 * A [React Hook]{@link https://reactjs.org/docs/hooks-intro.html} that contains
 * logic for handling a list of items.
 *
 * It returns the state of the list and an API object for managing the items in the list.
 */
export type useListState = Function;
export function useListState({ getItemKey, initialSelection, onSelectionChange, selectionModel }: any): any[];
/**
 * Item's key type.
 */
export type Key = string | number;
/**
 * The current state of the List.
 */
export type ListState = {
    cursor: Key;
    hasFocus: boolean;
    selectedKeys: Set<any>;
};

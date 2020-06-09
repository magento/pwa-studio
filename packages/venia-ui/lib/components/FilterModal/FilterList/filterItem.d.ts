export default FilterItem;
declare function FilterItem(props: any): JSX.Element;
declare namespace FilterItem {
    export namespace propTypes {
        export const filterApi: import("prop-types").Validator<import("prop-types").InferProps<{
            toggleItem: import("prop-types").Validator<(...args: any[]) => any>;
        }>>;
        export { setValidator as filterState };
        export const group: import("prop-types").Validator<string>;
        export const item: import("prop-types").Validator<import("prop-types").InferProps<{
            title: import("prop-types").Validator<string>;
            value: import("prop-types").Validator<string | number>;
        }>>;
    }
}

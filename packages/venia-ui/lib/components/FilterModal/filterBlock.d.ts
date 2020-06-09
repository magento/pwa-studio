export default FilterBlock;
declare function FilterBlock(props: any): JSX.Element;
declare namespace FilterBlock {
    export namespace propTypes {
        export const classes: import("prop-types").Requireable<import("prop-types").InferProps<{
            header: import("prop-types").Requireable<string>;
            list_collapsed: import("prop-types").Requireable<string>;
            list_expanded: import("prop-types").Requireable<string>;
            name: import("prop-types").Requireable<string>;
            root: import("prop-types").Requireable<string>;
            trigger: import("prop-types").Requireable<string>;
        }>>;
        export const filterApi: import("prop-types").Validator<import("prop-types").InferProps<{}>>;
        export { setValidator as filterState };
        export const group: import("prop-types").Validator<string>;
        export const items: import("prop-types").Requireable<import("prop-types").InferProps<{}>[]>;
        export const name: import("prop-types").Validator<string>;
    }
}

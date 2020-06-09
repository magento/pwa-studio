export default Branch;
declare function Branch(props: any): JSX.Element;
declare namespace Branch {
    export namespace propTypes {
        export const category: import("prop-types").Validator<import("prop-types").InferProps<{
            id: import("prop-types").Validator<number>;
            include_in_menu: import("prop-types").Requireable<number>;
            name: import("prop-types").Validator<string>;
        }>>;
        export const classes: import("prop-types").Requireable<import("prop-types").InferProps<{
            root: import("prop-types").Requireable<string>;
            target: import("prop-types").Requireable<string>;
            text: import("prop-types").Requireable<string>;
        }>>;
        export const setCategoryId: import("prop-types").Validator<(...args: any[]) => any>;
    }
}

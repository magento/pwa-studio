export default Leaf;
declare function Leaf(props: any): JSX.Element;
declare namespace Leaf {
    export namespace propTypes {
        export const category: import("prop-types").Validator<import("prop-types").InferProps<{
            name: import("prop-types").Validator<string>;
            url_path: import("prop-types").Validator<string>;
        }>>;
        export const classes: import("prop-types").Requireable<import("prop-types").InferProps<{
            root: import("prop-types").Requireable<string>;
            target: import("prop-types").Requireable<string>;
            text: import("prop-types").Requireable<string>;
        }>>;
        export const onNavigate: import("prop-types").Validator<(...args: any[]) => any>;
    }
}

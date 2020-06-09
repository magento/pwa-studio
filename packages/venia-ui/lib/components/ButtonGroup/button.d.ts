export default Button;
declare function Button(props: any): JSX.Element;
declare namespace Button {
    export namespace propTypes {
        export const classes: import("prop-types").Validator<import("prop-types").InferProps<{
            content: import("prop-types").Requireable<string>;
            root: import("prop-types").Requireable<string>;
        }>>;
    }
}

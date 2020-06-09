export default ProductOptions;
declare function ProductOptions(props: any): JSX.Element;
declare namespace ProductOptions {
    export namespace propTypes {
        export const options: import("prop-types").Requireable<import("prop-types").InferProps<{
            label: import("prop-types").Requireable<string>;
            value: import("prop-types").Requireable<string>;
        }>[]>;
    }
}

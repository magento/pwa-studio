export default ShippingRadio;
declare function ShippingRadio(props: any): JSX.Element;
declare namespace ShippingRadio {
    export namespace propTypes {
        export const classes: import("prop-types").Requireable<import("prop-types").InferProps<{
            price: import("prop-types").Requireable<string>;
        }>>;
        export const currency: import("prop-types").Validator<string>;
        export const name: import("prop-types").Validator<string>;
        export const price: import("prop-types").Validator<number>;
    }
}

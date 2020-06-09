export default Card;
declare function Card(props: any): JSX.Element;
declare namespace Card {
    export namespace propTypes {
        export const classes: import("prop-types").Requireable<import("prop-types").InferProps<{
            root: import("prop-types").Requireable<string>;
            address: import("prop-types").Requireable<string>;
            area: import("prop-types").Requireable<string>;
        }>>;
        export const shippingData: import("prop-types").Validator<import("prop-types").InferProps<{
            city: import("prop-types").Validator<string>;
            country: import("prop-types").Validator<import("prop-types").InferProps<{
                label: import("prop-types").Validator<string>;
            }>>;
            email: import("prop-types").Validator<string>;
            firstname: import("prop-types").Validator<string>;
            lastname: import("prop-types").Validator<string>;
            postcode: import("prop-types").Validator<string>;
            region: import("prop-types").Validator<import("prop-types").InferProps<{
                label: import("prop-types").Validator<string>;
            }>>;
            street: import("prop-types").Validator<string[]>;
            telephone: import("prop-types").Validator<string>;
        }>>;
    }
}

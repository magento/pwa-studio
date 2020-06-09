export default ProductFullDetail;
declare function ProductFullDetail(props: any): JSX.Element;
declare namespace ProductFullDetail {
    export namespace propTypes {
        export const classes: import("prop-types").Requireable<import("prop-types").InferProps<{
            cartActions: import("prop-types").Requireable<string>;
            description: import("prop-types").Requireable<string>;
            descriptionTitle: import("prop-types").Requireable<string>;
            details: import("prop-types").Requireable<string>;
            detailsTitle: import("prop-types").Requireable<string>;
            imageCarousel: import("prop-types").Requireable<string>;
            options: import("prop-types").Requireable<string>;
            productName: import("prop-types").Requireable<string>;
            productPrice: import("prop-types").Requireable<string>;
            quantity: import("prop-types").Requireable<string>;
            quantityTitle: import("prop-types").Requireable<string>;
            root: import("prop-types").Requireable<string>;
            title: import("prop-types").Requireable<string>;
        }>>;
        export const product: import("prop-types").Validator<import("prop-types").InferProps<{
            __typename: import("prop-types").Requireable<string>;
            id: import("prop-types").Requireable<number>;
            sku: import("prop-types").Validator<string>;
            price: import("prop-types").Validator<import("prop-types").InferProps<{
                regularPrice: import("prop-types").Validator<import("prop-types").InferProps<{
                    amount: import("prop-types").Requireable<import("prop-types").InferProps<{
                        currency: import("prop-types").Validator<string>;
                        value: import("prop-types").Validator<number>;
                    }>>;
                }>>;
            }>>;
            media_gallery_entries: import("prop-types").Requireable<import("prop-types").InferProps<{
                label: import("prop-types").Requireable<string>;
                position: import("prop-types").Requireable<number>;
                disabled: import("prop-types").Requireable<boolean>;
                file: import("prop-types").Validator<string>;
            }>[]>;
            description: import("prop-types").Requireable<string>;
        }>>;
    }
}

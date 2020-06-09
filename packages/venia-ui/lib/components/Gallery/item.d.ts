export default GalleryItem;
declare function GalleryItem(props: any): JSX.Element;
declare namespace GalleryItem {
    export namespace propTypes {
        export const classes: import("prop-types").Requireable<import("prop-types").InferProps<{
            image: import("prop-types").Requireable<string>;
            imageContainer: import("prop-types").Requireable<string>;
            imagePlaceholder: import("prop-types").Requireable<string>;
            image_pending: import("prop-types").Requireable<string>;
            images: import("prop-types").Requireable<string>;
            images_pending: import("prop-types").Requireable<string>;
            name: import("prop-types").Requireable<string>;
            name_pending: import("prop-types").Requireable<string>;
            price: import("prop-types").Requireable<string>;
            price_pending: import("prop-types").Requireable<string>;
            root: import("prop-types").Requireable<string>;
            root_pending: import("prop-types").Requireable<string>;
        }>>;
        export const item: import("prop-types").Requireable<import("prop-types").InferProps<{
            id: import("prop-types").Validator<number>;
            name: import("prop-types").Validator<string>;
            small_image: import("prop-types").Validator<string>;
            url_key: import("prop-types").Validator<string>;
            price: import("prop-types").Validator<import("prop-types").InferProps<{
                regularPrice: import("prop-types").Validator<import("prop-types").InferProps<{
                    amount: import("prop-types").Validator<import("prop-types").InferProps<{
                        value: import("prop-types").Validator<number>;
                        currency: import("prop-types").Validator<string>;
                    }>>;
                }>>;
            }>>;
        }>>;
    }
}

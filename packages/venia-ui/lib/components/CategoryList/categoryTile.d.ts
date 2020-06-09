export default CategoryTile;
declare function CategoryTile(props: any): JSX.Element;
declare namespace CategoryTile {
    export namespace propTypes {
        export const item: import("prop-types").Validator<import("prop-types").InferProps<{
            image: import("prop-types").Requireable<string>;
            name: import("prop-types").Validator<string>;
            productImagePreview: import("prop-types").Requireable<import("prop-types").InferProps<{
                items: import("prop-types").Requireable<import("prop-types").InferProps<{
                    small_image: import("prop-types").Requireable<string>;
                }>[]>;
            }>>;
            url_key: import("prop-types").Validator<string>;
        }>>;
        export const classes: import("prop-types").Requireable<import("prop-types").InferProps<{
            item: import("prop-types").Requireable<string>;
            image: import("prop-types").Requireable<string>;
            imageContainer: import("prop-types").Requireable<string>;
            name: import("prop-types").Requireable<string>;
        }>>;
    }
}

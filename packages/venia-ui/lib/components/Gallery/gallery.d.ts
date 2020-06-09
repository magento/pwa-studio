export default Gallery;
/**
 * Renders a Gallery of items. If items is an array of nulls Gallery will render
 * a placeholder item for each.
 *
 * @params {Array} props.items an array of items to render
 */
declare function Gallery(props: any): JSX.Element;
declare namespace Gallery {
    export namespace propTypes {
        export const classes: import("prop-types").Requireable<import("prop-types").InferProps<{
            filters: import("prop-types").Requireable<string>;
            items: import("prop-types").Requireable<string>;
            pagination: import("prop-types").Requireable<string>;
            root: import("prop-types").Requireable<string>;
        }>>;
        export const items: import("prop-types").Validator<any[]>;
    }
}

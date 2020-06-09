export default PlaceholderImage;
/**
 * A placeholder to use until the actual image is loaded.
 * This is used both for user experience and layout purposes.
 * Callers can disable the "user experience" part by setting displayPlaceholder to false.
 *
 * @param {string}   props.alt the alt attribute to apply to the image.
 * @param {object}   props.classes the pre-merged classes to apply to this component.
 * @param {bool}     props.displayPlaceholder whether or not to display a visual placeholder.
 * @param {number}   props.height the intrinsic height of the image.
 * @param {string}   props.imageHasError there was an error loading the actual image.
 * @param {string}   props.imageIsLoaded the actual image is loaded.
 * @param {string}   props.src the actual src of the placeholder image.
 * @param {number}   props.width the intrinsic width of the image.
 */
declare function PlaceholderImage(props: any): JSX.Element;
declare namespace PlaceholderImage {
    export namespace propTypes {
        export const alt: import("prop-types").Validator<string>;
        export const classes: import("prop-types").Validator<import("prop-types").InferProps<{
            image: import("prop-types").Requireable<string>;
            placeholder: import("prop-types").Requireable<string>;
            placeholder_layoutOnly: import("prop-types").Requireable<string>;
        }>>;
        export { bool as displayPlaceholder };
        export const height: import("prop-types").Requireable<string | number>;
        export { bool as imageHasError };
        export { bool as imageIsLoaded };
        export { string as src };
        export const width: import("prop-types").Requireable<string | number>;
    }
    export namespace defaultProps {
        export { transparentPlaceholder as src };
    }
}
import { bool } from "prop-types";
import { string } from "prop-types";

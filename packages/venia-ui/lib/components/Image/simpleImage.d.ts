export default SimpleImage;
/**
 * Renders an img element directly using the supplied src.
 *
 * @param {String}  props.alt - The alt attribute for the img element.
 * @param {String}  props.className - The class name to apply to the img element.
 * @param {Func}    props.handleError - The function to call if the image fails to load.
 * @param {Func}    props.handleLoad - The function to call if the image successfully loads.
 * @param {Number}  props.height - The height of the img element.
 * @param {String}  props.src - The src attribute for the img element.
 * @param {Number}  props.width - The width of the img element.
 */
declare function SimpleImage(props: any): JSX.Element;
declare namespace SimpleImage {
    export namespace propTypes {
        export const alt: import("prop-types").Validator<string>;
        export { string as className };
        export { func as handleError };
        export { func as handleLoad };
        export const height: import("prop-types").Requireable<string | number>;
        export const src: import("prop-types").Validator<string>;
        export const width: import("prop-types").Requireable<string | number>;
    }
}
import { string } from "prop-types";
import { func } from "prop-types";

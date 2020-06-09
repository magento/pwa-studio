export default Image;
/**
 * The Image component renders a placeholder until the image is loaded.
 *
 * @param {object}   props.classes any classes to apply to this component
 * @param {bool}     props.displayPlaceholder whether or not to display a placeholder while the image loads or if it errors on load.
 * @param {number}   props.height the intrinsic height of the image & the height to request for the fallback image for browsers that don't support srcset / sizes.
 * @param {function} props.onError callback for error loading image
 * @param {function} props.onLoad callback for when image loads successfully
 * @param {string}   props.placeholder the placeholder source to display while the image loads or if it errors on load
 * @param {string}   props.resource the Magento path to the image ex: /v/d/vd12-rn_main_2.jpg
 * @param {string}   props.src the source of the image, ready to use in an img element
 * @param {string}   props.type the Magento image type ("image-category" / "image-product"). Used to build the resource URL.
 * @param {number}   props.width the intrinsic width of the image & the width to request for the fallback image for browsers that don't support srcset / sizes.
 * @param {number}   props.ratio is the image width to height ratio. Defaults to `DEFAULT_WIDTH_TO_HEIGHT_RATIO` from `util/images.js`.
 * @param {Map}      props.widths a map of breakpoints to possible widths used to create the img's sizes attribute.
 */
declare function Image(props: any): JSX.Element;
declare namespace Image {
    export const propTypes: {
        alt: PropTypes.Validator<string>;
        classes: PropTypes.Requireable<PropTypes.InferProps<{
            container: PropTypes.Requireable<string>;
            loaded: PropTypes.Requireable<string>;
            notLoaded: PropTypes.Requireable<string>;
            root: PropTypes.Requireable<string>;
        }>>;
        displayPlaceholder: PropTypes.Requireable<boolean>;
        height: PropTypes.Requireable<string | number>;
        onError: PropTypes.Requireable<(...args: any[]) => any>;
        onLoad: PropTypes.Requireable<(...args: any[]) => any>;
        placeholder: PropTypes.Requireable<string>;
        resource: (props: any, propName: any, componentName: any) => void | Error;
        src: (props: any, propName: any, componentName: any) => void | Error;
        type: PropTypes.Requireable<string>;
        width: PropTypes.Requireable<string | number>;
        widths: PropTypes.Requireable<Map<unknown, unknown>>;
        ratio: PropTypes.Requireable<number>;
    };
    export namespace defaultProps {
        export const displayPlaceholder: boolean;
        export { DEFAULT_WIDTH_TO_HEIGHT_RATIO as ratio };
    }
}
import PropTypes from "prop-types";
import { DEFAULT_WIDTH_TO_HEIGHT_RATIO } from "../../util/images";

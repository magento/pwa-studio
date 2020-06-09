export default ResourceImage;
/**
 * Renders a Magento resource image.
 *
 * @param {string}   props.alt the alt attribute to apply to the image.
 * @param {string}   props.className the class to apply to this image.
 * @param {Func}     props.handleError the function to call if the image fails to load.
 * @param {Func}     props.handleLoad the function to call if the image successfully loads.
 * @param {number}   props.height the height to request for the fallback image for browsers that don't support srcset / sizes.
 * @param {string}   props.resource the Magento path to the image ex: /v/d/vd12-rn_main_2.jpg
 * @param {string}   props.type the Magento image type ("image-category" / "image-product"). Used to build the resource URL.
 * @param {number}   props.width the intrinsic width of the image & the width to request for the fallback image for browsers that don't support srcset / sizes.
 * @param {Map}      props.widths a map of breakpoints to possible widths used to create the img's sizes attribute.
 * @param {number}   props.ratio is the image width to height ratio. Defaults to 4/5.
 */
declare function ResourceImage(props: any): JSX.Element;
declare namespace ResourceImage {
    export const propTypes: {
        alt: import("prop-types").Validator<string>;
        className: import("prop-types").Requireable<string>;
        handleError: import("prop-types").Requireable<(...args: any[]) => any>;
        handleLoad: import("prop-types").Requireable<(...args: any[]) => any>;
        resource: import("prop-types").Validator<string>;
        height: import("prop-types").Requireable<string | number>;
        type: import("prop-types").Requireable<string>;
        width: import("prop-types").Requireable<string | number>;
        widths: import("prop-types").Requireable<Map<unknown, unknown>>;
    };
    export const defaultProps: {
        type: string;
    };
}

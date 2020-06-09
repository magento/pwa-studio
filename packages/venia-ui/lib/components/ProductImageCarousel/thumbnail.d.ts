export default Thumbnail;
/**
 * The Thumbnail Component is used for showing thumbnail preview image for ProductImageCarousel
 * Shows up only in desktop devices
 */
export type Thumbnail = any;
/**
 * Props for {@link Thumbnail}
 */
export type props = {
    /**
     * An object containing the class names for the Thumbnail component
     */
    classes: {
        root: string;
        rootSelected: string;
    };
    /**
     * is image associated is active in carousel
     */
    isActive: import("prop-types").Requireable<boolean>;
    /**
     * label for image
     */
    label: string;
    /**
     * filePath of image
     */
    file: string;
    /**
     * index number of thumbnail
     */
    itemIndex: number;
    /**
     * A callback for handling click events on thumbnail
     */
    onClickHandler: import("prop-types").Requireable<(...args: any[]) => any>;
};
/**
 * The Thumbnail Component is used for showing thumbnail preview image for ProductImageCarousel
 * Shows up only in desktop devices
 *
 * @typedef Thumbnail
 * @kind functional component
 *
 * @param {props} props
 *
 * @returns {React.Element} React thumbnail component that displays product thumbnail
 */
declare function Thumbnail(props: props): any;
declare namespace Thumbnail {
    export namespace propTypes {
        export const classes: import("prop-types").Requireable<import("prop-types").InferProps<{
            root: import("prop-types").Requireable<string>;
            rootSelected: import("prop-types").Requireable<string>;
        }>>;
        export { bool as isActive };
        export const item: import("prop-types").Requireable<import("prop-types").InferProps<{
            label: import("prop-types").Requireable<string>;
            file: import("prop-types").Validator<string>;
        }>>;
        export { number as itemIndex };
        export const onClickHandler: import("prop-types").Validator<(...args: any[]) => any>;
    }
}
import { bool } from "prop-types";
import { number } from "prop-types";

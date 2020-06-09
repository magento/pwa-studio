export default ProductImageCarousel;
/**
 * Carousel component for product images
 * Carousel - Component that holds number of images
 * where typically one image visible, and other
 * images can be navigated through previous and next buttons
 */
export type ProductImageCarousel = any;
/**
 * Props for {@link ProductImageCarousel}
 */
export type props = {
    /**
     * An object containing the class names for the
     * ProductImageCarousel component
     */
    classes: {
        currentImage: string;
        imageContainer: string;
        nextButton: string;
        previousButton: string;
        root: string;
    };
    /**
     * Product images input for Carousel
     */
    images: {
        label: string;
    };
    /**
     * Position of image in Carousel
     */
    position: string;
    /**
     * Is image disabled
     */
    disabled: import("prop-types").Requireable<boolean>;
    /**
     * filePath of image
     */
    file: string;
};
/**
 * Carousel component for product images
 * Carousel - Component that holds number of images
 * where typically one image visible, and other
 * images can be navigated through previous and next buttons
 *
 * @typedef ProductImageCarousel
 * @kind functional component
 *
 * @param {props} props
 *
 * @returns {React.Element} React carousel component that displays a product image
 */
declare function ProductImageCarousel(props: props): any;
declare namespace ProductImageCarousel {
    export namespace propTypes {
        export const classes: import("prop-types").Requireable<import("prop-types").InferProps<{
            carouselContainer: import("prop-types").Requireable<string>;
            currentImage: import("prop-types").Requireable<string>;
            currentImage_placeholder: import("prop-types").Requireable<string>;
            imageContainer: import("prop-types").Requireable<string>;
            nextButton: import("prop-types").Requireable<string>;
            previousButton: import("prop-types").Requireable<string>;
            root: import("prop-types").Requireable<string>;
        }>>;
        export const images: import("prop-types").Validator<import("prop-types").InferProps<{
            label: import("prop-types").Requireable<string>;
            position: import("prop-types").Requireable<number>;
            disabled: import("prop-types").Requireable<boolean>;
            file: import("prop-types").Validator<string>;
        }>[]>;
    }
}

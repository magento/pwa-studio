/**
 * The talon for working with PlaceholderImages.
 * Determines whether the visual placeholder should be rendered or not.
 *
 * @param {bool}     props.displayPlaceholder whether or not to display a visual placeholder.
 * @param {string}   props.imageHasError there was an error loading the actual image.
 * @param {string}   props.imageIsLoaded the actual image is loaded.
 */
export const usePlaceholderImage = props => {
    const { displayPlaceholder, imageHasError, imageIsLoaded } = props;

    // Render the placeholder unless we've been told not to,
    // or we've already loaded without error.
    const hidePlaceholder =
        !displayPlaceholder || (imageIsLoaded && !imageHasError);
    const shouldRenderPlaceholder = !hidePlaceholder;

    return {
        shouldRenderPlaceholder
    };
};

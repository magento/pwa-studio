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

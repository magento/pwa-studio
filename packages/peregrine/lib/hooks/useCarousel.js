import { useCallback, useReducer, useMemo } from 'react';
import withLogger from '../util/withLogger';

const sortImages = (images = []) =>
    images
        .filter(({ disabled }) => !disabled)
        .sort((a, b) => a.position - b.position);

const reducer = (state, action) => {
    switch (action.type) {
        case 'previous':
            if (state.index > 0) {
                return { ...state, index: state.index - 1 };
            } else {
                return { ...state, index: state.length - 1 };
            }
        case 'next':
            return { ...state, index: (state.index + 1) % state.length };
        case 'set':
            return { ...state, index: action.value };
        default:
            throw new Error('Unknown carousel action.');
    }
};

const wrappedReducer = withLogger(reducer);

/**
 * A hook for interacting with the state of a carousel of images.
 *
 * @param {Array} images an array of image objects
 * @param {number} startIndex the index at which to start the carousel
 */
export const useCarousel = (images = [], startIndex = 0) => {
    const [{ index }, dispatch] = useReducer(wrappedReducer, {
        index: startIndex,
        length: images.length
    });
    const sortedImages = useMemo(() => sortImages(images), [images]);

    const handlePrevious = useCallback(
        () => dispatch({ type: 'previous' }),
        []
    );

    const handleNext = useCallback(() => dispatch({ type: 'next' }), []);

    const setActiveItemIndex = useCallback(
        index => dispatch({ type: 'set', value: index }),
        []
    );

    const api = useMemo(
        () => ({ handlePrevious, handleNext, setActiveItemIndex }),
        [handlePrevious, handleNext, setActiveItemIndex]
    );

    const state = {
        activeItemIndex: index,
        sortedImages
    };

    return [state, api];
};

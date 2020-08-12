import { useEffect } from 'react';

/**
 * Scrolls a ref into view on truthiness of a thing.
 *
 * @param {React.Ref} ref
 * @param {Any} thing triggers scrolling if truthy
 * @param {Object} options https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView
 */
export const useScrollIntoView = (
    ref,
    thing,
    options = {
        behavior: 'smooth',
        block: 'center'
    }
) => {
    useEffect(() => {
        if (
            ref.current &&
            typeof ref.current.scrollIntoView !== 'undefined' &&
            !!thing
        ) {
            ref.current.scrollIntoView(options);
        }
    }, [options, ref, thing]);
};

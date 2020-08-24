import { useEffect } from 'react';

const OPTIONS_DEFAULTS = { behavior: 'smooth', block: 'center' };

/**
 * Scrolls a ref into view on truthiness of a thing.
 *
 * @param {React.Ref} ref
 * @param {Boolean} shouldScroll allows scrolling if truthy
 * @param {OPTIONS_DEFAULTS} options https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView
 */
export const useScrollIntoView = (
    ref,
    shouldScroll,
    options = OPTIONS_DEFAULTS
) => {
    useEffect(() => {
        if (ref.current && ref.current instanceof HTMLElement && shouldScroll) {
            ref.current.scrollIntoView(options);
        }
    }, [options, ref, shouldScroll]);
};

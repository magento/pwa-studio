import { useEffect, useState } from 'react';

import useIntersectionObserver from '@magento/peregrine/lib/hooks/useIntersectionObserver';

export const useIsInViewport = props => {
    const { elementRef, renderOnce = true } = props;
    const intersectionObserver = useIntersectionObserver();
    const [isInViewport, setIsInViewport] = useState(false);

    useEffect(() => {
        if (!elementRef || !elementRef.current || !intersectionObserver) {
            setIsInViewport(true);

            return null;
        }

        // Prevent init if already rendered once
        if (isInViewport && renderOnce) {
            return null;
        }

        const htmlElement = elementRef.current;
        const elementObserver = new IntersectionObserver(
            (entries, observer) => {
                const isIntersecting =
                    entries.some(entry => entry.isIntersecting) === true;
                setIsInViewport(isIntersecting);

                // Stop observing if already rendered once
                if (isIntersecting && renderOnce) {
                    observer.unobserve(htmlElement);
                }
            }
        );

        elementObserver.observe(htmlElement);

        return () => {
            elementObserver.unobserve(htmlElement);
        };
    }, [elementRef, intersectionObserver, isInViewport, renderOnce]);

    return isInViewport;
};

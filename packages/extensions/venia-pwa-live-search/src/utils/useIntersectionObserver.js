import { useEffect, useState } from 'react';

export const useIntersectionObserver = (ref, options) => {
    const { rootMargin } = options;
    const [observerEntry, setObserverEntry] = useState(null);

    useEffect(() => {
        if (!ref?.current) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                setObserverEntry(entry);
                if (entry.isIntersecting) {
                    observer.unobserve(entry.target);
                }
            },
            { rootMargin }
        );

        observer.observe(ref.current);

        return () => {
            observer.disconnect();
        };
    }, [ref, rootMargin]);

    return observerEntry;
};

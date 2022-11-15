export const useIntersectionObserver = () => {
    if (typeof IntersectionObserver === 'undefined') {
        return;
    }

    return IntersectionObserver;
};

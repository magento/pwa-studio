export default () => {
    if (typeof IntersectionObserver === 'undefined') {
        return;
    }

    return IntersectionObserver;
};

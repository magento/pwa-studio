/**
 * Helper function for onClick() HTML Events
 *
 * @param {object} history history object
 * @param {function} history.push Pushes a new entry onto the history stack
 * @param {Event} event
 */
const handleHtmlContentClick = (history, event) => {
    const { code, target, type } = event;

    // Check if element is clicked or using accepted keyboard event
    const shouldIntercept =
        type === 'click' || code === 'Enter' || code === 'Space';

    // Intercept link clicks and check to see if the
    // destination is internal to avoid refreshing the page
    if (target.tagName === 'A' && shouldIntercept) {
        event.preventDefault();
        const { search: query, target: tabTarget, href } = target;

        if (tabTarget && globalThis.open) {
            if (query) {
                globalThis.open(href + query);
            } else {
                globalThis.open(href);
            }
        } else {
            globalThis.location.assign(href);
        }
    }
};

export default handleHtmlContentClick;

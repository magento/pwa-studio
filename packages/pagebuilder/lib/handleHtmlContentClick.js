/**
 * Helper function for onClick() HTML Events
 *
 * @param {object} history history object
 * @param {function} history.push Pushes a new entry onto the history stack
 * @param {Event} event
 */
const handleHtmlContentClick = (history, event) => {
    const { target } = event;
    // Intercept link clicks and check to see if the
    // destination is internal to avoid refreshing the page
    if (target.tagName === 'A') {
        event.preventDefault();

        const eventOrigin = event.view.location.origin;

        const {
            origin: linkOrigin,
            pathname: path,
            target: tabTarget,
            href
        } = target;

        if (tabTarget && globalThis.open) {
            globalThis.open(href, '_blank');
        } else if (linkOrigin === eventOrigin) {
            history.push(path);
        } else {
            globalThis.location.assign(href);
        }
    }
};

export default handleHtmlContentClick;

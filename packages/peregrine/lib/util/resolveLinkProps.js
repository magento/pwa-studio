/**
 * Resolve link properties
 *
 * @param {string} link
 */
export default link => {
    let isExternalUrl;
    const linkProps = {};

    try {
        const baseUrlObj = new URL(process.env.MAGENTO_BACKEND_URL);
        const urlObj = new URL(link, baseUrlObj);
        isExternalUrl = baseUrlObj.host !== urlObj.host;

        if (isExternalUrl) {
            linkProps['href'] = link;
        } else {
            linkProps['to'] = urlObj.pathname;
        }
    } catch (e) {
        linkProps['href'] = link;
    }

    return linkProps;
};

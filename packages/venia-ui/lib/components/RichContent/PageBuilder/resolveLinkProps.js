/**
 * Resolve link properties
 *
 * @param {string} link
 * @param {string} linkType
 */
export default (link, linkType) => {
    let isExternalUrl;
    const linkProps = {};

    try {
        const baseUrlObj = new URL(process.env.MAGENTO_BACKEND_URL);
        const urlObj = new URL(link);
        isExternalUrl = baseUrlObj.host !== urlObj.host;

        if (isExternalUrl) {
            linkProps['href'] = link;
        } else {
            linkProps['to'] = urlObj.pathname;
            if (linkType !== 'default' && !/\.html$/.test(linkProps['to'])) {
                linkProps['to'] += '.html';
            }
        }
    } catch (e) {
        linkProps['href'] = link;
    }

    return linkProps;
};

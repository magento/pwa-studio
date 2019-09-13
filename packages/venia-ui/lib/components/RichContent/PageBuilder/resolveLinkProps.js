export default (link, linkType) => {
    let isExternalUrl;
    const linkProps = {};

    try {
        const baseUrl = document
            .querySelector('link[rel="preconnect"]')
            .getAttribute('href'); // TODO - some better way to get this?
        const baseUrlObj = new URL(baseUrl);
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

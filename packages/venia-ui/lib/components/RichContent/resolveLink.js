export default (link, linkType) => {
    let isExternalUrl;
    const linkOpts = {};

    try {
        const baseUrl = document.querySelector('link[rel="preconnect"]').getAttribute('href'); // TODO - some better way to get this?
        const baseUrlObj = new URL(baseUrl);
        const urlObj = new URL(link);
        isExternalUrl = baseUrlObj.host !== urlObj.host;

        if (isExternalUrl) {
            linkOpts['href'] = link;
        } else {
            linkOpts['to'] = urlObj.pathname;
            if (linkType !== 'default' && !/\.html$/.test(linkOpts['to'])) {
                linkOpts['to'] += '.html';
            }
        }
    } catch (e) {
        linkOpts['href'] = link;
    }

    return {
        linkOpts
    };
};

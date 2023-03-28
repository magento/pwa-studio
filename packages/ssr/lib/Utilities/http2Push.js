const addHttp2PushLinkHeader = (res, linkTags) => {
    const headerLink = linkTags
        .map(linkTag => {
            // const linkHref = curr.match(/href=\".*\"/)
            const linkMatch = linkTag.match(
                /href=('|")([^('|")]*\.(js|css|woff2?)('|"))/
            );

            if (linkMatch) {
                const href = linkMatch[0].replace(/(href=)?("|')/g, '');
                const as = /\.js/.test(href)
                    ? 'script'
                    : /\.css/.test(href)
                    ? 'style'
                    : 'font';
                return `<${href}>;rel="preload";as=${as}`;
            }

            return null;
        })
        .filter(linkTag => linkTag)
        .join(', ');

    if (headerLink) {
        res.setHeader('link', headerLink);
    }
};

module.exports = { addHttp2PushLinkHeader };

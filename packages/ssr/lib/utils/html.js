const { Base64 } = require('js-base64');

const normalizeApolloState = apolloState =>
    process.env.SSR_ENCODE_APOLLO_STATE
        ? `"${Base64.encode(JSON.stringify(apolloState))}"`
        : JSON.stringify(apolloState).replace(/</g, '\\u003c');

const normalizeHTMLContent = html =>
    html
        .replace(/&#x27;/g, "'")
        .replace(/&quot;/g, '"')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&');

/**
 *
 * @param {string} template
 * @param {string} content
 * @param {ChunkExtractor} webExtractor
 * @param {{helmet?: any}} helmetContext
 * @param {any} staticContext
 * @param {any} apolloState
 * @returns
 */
const buildHTML = (
    template,
    content,
    webExtractor,
    helmetContext,
    staticContext,
    apolloState
) => {
    let html = template;
    let headTags = '';
    let bodyTags = '';

    // Sort order of preload link tags: css, other.
    headTags += webExtractor
        .getLinkTags()
        .split('\n')
        .sort((a, b) => (/\.css/.test(a) && !/\.css/.test(b) ? -1 : 1))
        .join('\n');

    headTags += webExtractor.getStyleTags();

    // Extract Helmet tags
    const { helmet } = helmetContext;
    if (helmet) {
        headTags +=
            helmet.title.toString() +
            helmet.meta.toString() +
            helmet.link.toString() +
            helmet.style.toString();
    }

    if (staticContext.linkTags) {
        headTags += staticContext.linkTags;
    }

    bodyTags += `<script>window.__APOLLO_STATE__=${normalizeApolloState(
        apolloState
    )};</script>`;

    bodyTags += webExtractor.getScriptTags();

    // Remove title tag from HTML template if exists in the headTags
    if (headTags.match(/<title>/)) {
        html = template.replace(/<title>[^<]*<\/title>/, '');
    }

    return html
        .replace(/<\/head>/, `${headTags}</head>`)
        .replace(
            /<div id="root"><\/div>/,
            `<div id="root">${normalizeHTMLContent(content)}</div>`
        )
        .replace(/<\/body>/, `${bodyTags}</body>`);
};

module.exports = {
    buildHTML
};

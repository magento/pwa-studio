/**
 *
 * @param {string} html
 * @param {{head: string, body: string, content: string}} sections
 * @returns
 */
const createHTML = (html, sections) => {
    let content = html;

    // Remove title tag from HTML template to prevent duplicate
    if (sections.head.match(/<title>/)) {
        content = html.replace(/<title>[^<]*<\/title>/);
    }

    return content
        .replace(/<\/head>/, `${sections.head}</head>`)
        .replace(
            /<div id="root"><\/div>/,
            `<div id="root">${sections.content}</div>`
        )
        .replace(/<\/body>/, `${sections.body}</body>`);
};

module.exports = {
    createHTML
};

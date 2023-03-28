const { JSDOM } = require('jsdom');

// Properties to add as Node global
const properties = [
    'document',
    // For PageBuilder
    'DOMParser',
    'NodeFilter',
    'Node'
];

function createDOM(template, url) {
    // See: https://github.com/jsdom/jsdom#simple-options
    const dom = new JSDOM(template.toString(), { url });

    const emulatedDom = {};

    properties.forEach(property => {
        emulatedDom[property] = dom.window[property];
    });

    return emulatedDom;
}

module.exports = {
    createDOM
};

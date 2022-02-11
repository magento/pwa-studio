import { getContentTypeConfig } from './config';

/**
 * Create a basic object representing a content type in our tree
 *
 * @param type
 * @param node
 * @returns {{appearance: any, children: Array, contentType: *}}
 */
const createContentTypeObject = (type, node) => {
    return {
        contentType: type,
        appearance: node ? node.getAttribute('data-appearance') : null,
        children: []
    };
};

/**
 * Walk over tree nodes extracting each content types configuration
 *
 * @param {Node} rootEl
 * @param {Object} contentTypeStructureObj
 * @returns {Object}
 */
const walk = (rootEl, contentTypeStructureObj) => {
    const tree = document.createTreeWalker(
        rootEl,
        NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT
    );

    let currentNode = tree.nextNode();
    while (currentNode) {
        if (currentNode.nodeType !== Node.ELEMENT_NODE) {
            currentNode = tree.nextNode();
            continue;
        }

        const contentType = currentNode.getAttribute('data-content-type');

        if (!contentType) {
            currentNode = tree.nextNode();
            continue;
        }

        const props = createContentTypeObject(contentType, currentNode);
        const contentTypeConfig = getContentTypeConfig(contentType);

        if (
            contentTypeConfig &&
            typeof contentTypeConfig.configAggregator === 'function'
        ) {
            try {
                Object.assign(
                    props,
                    contentTypeConfig.configAggregator(currentNode, props)
                );
            } catch (e) {
                console.error(
                    `Failed to aggregate config for content type ${contentType}.`,
                    e
                );
            }
        } else {
            console.warn(
                `Page Builder ${contentType} content type is not supported, this content will not be rendered.`
            );
        }

        contentTypeStructureObj.children.push(props);
        walk(currentNode, props);
        currentNode = tree.nextSibling();
    }

    return contentTypeStructureObj;
};

const pbStyleAttribute = 'data-pb-style';
const bodyId = 'html-body';

/**
 * Convert styles block to inline styles.
 * @param {HTMLDocument} document
 */
const convertToInlineStyles = document => {
    const styleBlocks = document.getElementsByTagName('style');
    const styles = {};
    const mediaStyles = {};

    if (styleBlocks.length > 0) {
        Array.from(styleBlocks).forEach(styleBlock => {
            const cssRules = styleBlock.sheet.cssRules;

            Array.from(cssRules).forEach(rule => {
                if (rule instanceof CSSStyleRule) {
                    const selectors = rule.selectorText
                        .split(',')
                        .map(selector => selector.trim());
                    selectors.forEach(selector => {
                        if (!styles[selector]) {
                            styles[selector] = [];
                        }
                        styles[selector].push(rule.style);
                    });
                } else if (rule instanceof CSSMediaRule) {
                    Array.from(rule.media).forEach(media => {
                        const styles = Array.from(rule.cssRules).map(rule => {
                            return {
                                selectors: rule.selectorText
                                    .split(',')
                                    .map(selector => selector.trim()),
                                css: rule.style.cssText
                            };
                        });
                        mediaStyles[media] = styles;
                    });
                }
            });
        });
    }

    Object.keys(mediaStyles).map((media, i) => {
        mediaStyles[media].forEach(style => {
            style.selectors.forEach(selector => {
                const element = document.querySelector(selector);
                if (element) {
                    element.setAttribute(`data-media-${i}`, media);
                    const savedStyles = element.getAttribute(
                        `data-media-style-${i}`
                    );
                    // avoids overwriting previously saved styles
                    element.setAttribute(
                        `data-media-style-${i}`,
                        `${savedStyles ? `${savedStyles} ` : ''}${style.css}`
                    );
                }
            });
        });
    });

    Object.keys(styles).map(selector => {
        const element = document.querySelector(selector);
        if (!element) {
            return;
        }

        styles[selector].map(style => {
            element.setAttribute(
                'style',
                element.style.cssText + style.cssText
            );
        });
        element.removeAttribute(pbStyleAttribute);
    });
};

/**
 * Parse the master format storage HTML
 *
 * @param {String} htmlStr
 * @returns {Object}
 */
const parseStorageHtml = htmlStr => {
    const container = new DOMParser().parseFromString(htmlStr, 'text/html');

    const stageContentType = createContentTypeObject('root-container');

    container.body.id = bodyId;
    convertToInlineStyles(container);

    return walk(container.body, stageContentType);
};

export default parseStorageHtml;

import getContentTypeConfig from './config';

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

/**
 * Parse the master format storage HTML
 *
 * @param {String} htmlStr
 * @returns {Object}
 */
const parseStorageHtml = htmlStr => {
    const container = new DOMParser().parseFromString(htmlStr, 'text/html');

    const stageContentType = createContentTypeObject('root-container');

    return walk(container.body, stageContentType);
};

export default parseStorageHtml;

import rowConfigAggregator from './PageBuilder/ContentTypes/Row/configAggregator';
import imageConfigAggregator from './PageBuilder/ContentTypes/Image/configAggregator';
import headingConfigAggregator from './PageBuilder/ContentTypes/Heading/configAggregator';

const pageBuilderConfigAggregators = {
    row: rowConfigAggregator,
    image: imageConfigAggregator,
    heading: headingConfigAggregator
};

const createContentTypeObject = (type, node) => {
    return {
        contentType: type,
        appearance: node ? node.getAttribute('data-appearance') : null,
        children: []
    };
};

/**
 * @param {HTMLElement} rootEl
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
            contentTypeStructureObj.text = currentNode.textContent;
            currentNode = tree.nextNode();
            continue;
        }

        const contentType = currentNode.getAttribute('data-content-type');

        if (!contentType) {
            currentNode = tree.nextNode();
            continue;
        }

        const props = createContentTypeObject(contentType, currentNode);

        if (pageBuilderConfigAggregators[contentType]) {
            Object.assign(
                props,
                pageBuilderConfigAggregators[contentType](currentNode)
            );
        }

        contentTypeStructureObj.children.push(props);
        walk(currentNode, props);
        currentNode = tree.nextSibling();
    }

    return contentTypeStructureObj;
};

/**
 * @param {String} htmlStr
 * @returns {Object}
 */
const parseStorageHtml = htmlStr => {
    const container = document.createElement('div');
    container.innerHTML = htmlStr;

    const stageContentType = createContentTypeObject('root-container');

    return walk(container, stageContentType);
};

export default parseStorageHtml;

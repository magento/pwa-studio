import rowConfigAggregator from './PageBuilder/ContentTypes/Row/configAggregator';
import imageConfigAggregator from './PageBuilder/ContentTypes/Image/configAggregator';


const pageBuilderConfigAggregators = {
    row: rowConfigAggregator,
    image: imageConfigAggregator,
};

const createContentTypeObject = (contentTypeStr) => {
    return {
        contentType: contentTypeStr,
        children: [],
    };
};

const aggregateStyles = (contentTypeConfigObj, node) => {
    const style = contentTypeConfigObj.style || {};
    const styleLen = node.style.length;

    // TODO - determine if this string pre-processing is necessary
    for (let i = 0; i < styleLen; i++) {
        const domName = node.style[i]
            .replace(/\-\-/, '') // remove first occurrence of two consecutive hyphens (vendor prefixes)
            .replace(/\-([a-z])/g, match => match[1].toUpperCase()); // convert kebab-case to camelcase
        style[domName] = node.style[domName];
    }

    contentTypeConfigObj.style = style;

    return contentTypeConfigObj;
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
            currentNode = tree.nextNode();
            continue;
        }

        const contentType = currentNode.getAttribute('data-content-type');

        if (!contentType) {
            // TODO - namespace styles onto this object (somehow)!
            aggregateStyles(contentTypeStructureObj, currentNode);
            currentNode = tree.nextNode();
            continue;
        }

        const props = aggregateStyles(createContentTypeObject(contentType), currentNode);

        if (pageBuilderConfigAggregators[contentType]) {
            Object.assign(props, pageBuilderConfigAggregators[contentType](currentNode));
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

    const stageContentType = createContentTypeObject('stage');

    return walk(container, stageContentType);
};

export default parseStorageHtml;

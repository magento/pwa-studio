import rowConfigAggregator from './PageBuilder/ContentTypes/Row/configAggregator';
import columnConfigAggregator from './PageBuilder/ContentTypes/Column/configAggregator';
import columnGroupConfigAggregator from './PageBuilder/ContentTypes/ColumnGroup/configAggregator';
import imageConfigAggregator from './PageBuilder/ContentTypes/Image/configAggregator';
import headingConfigAggregator from './PageBuilder/ContentTypes/Heading/configAggregator';
import textConfigAggregator from './PageBuilder/ContentTypes/Text/configAggregator';

// TODO move to configuration
const pageBuilderConfigAggregators = {
    row: rowConfigAggregator,
    column: columnConfigAggregator,
    'column-group': columnGroupConfigAggregator,
    image: imageConfigAggregator,
    heading: headingConfigAggregator,
    text: textConfigAggregator
};

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

        if (pageBuilderConfigAggregators[contentType]) {
            try {
                Object.assign(
                    props,
                    pageBuilderConfigAggregators[contentType](
                        currentNode,
                        props
                    )
                );
            } catch (e) {
                console.error(
                    `Failed to aggregate config for content type ${contentType}.`,
                    e
                );
            }
        } else {
            console.warn(
                `No config aggregator defined for content type ${contentType}, this content type won't be rendered.`
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
    const container = document.createElement('div');
    container.innerHTML = htmlStr;

    const stageContentType = createContentTypeObject('root-container');

    return walk(container, stageContentType);
};

export default parseStorageHtml;

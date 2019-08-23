const createContentTypeObject = (contentTypeStr) => {
    return {
        contentType: contentTypeStr,
        children: [],
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
            currentNode = tree.nextNode();
            continue;
        }

        const contentType = currentNode.getAttribute('data-content-type');

        if (!contentType) {
            currentNode = tree.nextNode();
            continue;
        }

        const props = {
            type: contentType,
            children: [],
        };

        if (pageBuilderVisitors[contentType]) {
            Object.assign(props, pageBuilderVisitors[contentType](currentNode));
        }

        contentTypeStructureObj.children.push(props);
        walk(currentNode, props);
        currentNode = tree.nextSibling();
    }

    return contentTypeStructureObj;
};

const pageBuilderVisitors = {
    row(node) {
        return {
            appearance: node.getAttribute("data-appearance"),
            enableParallax: node.childNodes[0].getAttribute("data-enable-parallax"),
        }
    },
    image(node) {
        return {
            appearance: node.getAttribute("data-appearance"),
            desktopImage: node.childNodes[0].getAttribute("src"),
            mobileImage: node.childNodes[1].getAttribute("src"),
        }
    }
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

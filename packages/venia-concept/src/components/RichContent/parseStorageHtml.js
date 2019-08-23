/**
 * @param {HTMLElement} rootEl
 * @returns {Object}
 */
const walk = (rootEl, treeArray) => {
    if (!treeArray) {
        treeArray = {
            contentType: "stage",
            children: []
        };
    }

    const tree = document.createTreeWalker(
        rootEl,
        NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT
    );

    let currentNode = tree.nextNode();
    while (currentNode) {
        if (currentNode.nodeType === Node.ELEMENT_NODE) {
            const contentType = currentNode.getAttribute('data-content-type');
            if (contentType) {
                let props = {
                    type: contentType,
                    children: [],
                };
                if (pageBuilderVisitors[contentType]) {
                    props = Object.assign(props, pageBuilderVisitors[contentType](currentNode));
                }
                treeArray.children.push(props);
                walk(currentNode, props);
                currentNode = tree.nextSibling();
            } else {
                currentNode = tree.nextNode();
            }
        } else {
            currentNode = tree.nextNode();
        }
    }

    return treeArray;
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

    return walk(container);
};

export default parseStorageHtml;

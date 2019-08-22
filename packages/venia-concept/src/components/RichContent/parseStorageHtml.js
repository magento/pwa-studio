const attrToProp = {
    class: 'className',
    allowfullscreen: 'allowFullScreen',
    frameborder: 'frameBorder'
};

let smallScreen;

/**
 * @param {HTMLElement} htmlEl
 * @returns {Object}
 */
const serializeElement = htmlEl => {
    if (htmlEl.nodeType === Node.TEXT_NODE) {
        return htmlEl.textContent;
    }

    const element = {
        children: [],
        elements: {},
        domAttributes: {},
        dataAttributes: {},
        tagName: htmlEl.tagName.toLowerCase(),
    };

    element.domAttributes.className = '';

    for (const attr of htmlEl.attributes) {
        if (attrToProp.hasOwnProperty(attr.name)) {
            element.domAttributes[attrToProp[attr.name]] = attr.value;
        } else if (attr.name !== 'style') {
            element.domAttributes[attr.name] = attr.value;
        }
    }

    // convert className attribute to array for easy appending/removing
    // TODO - rethink this
    element.domAttributes.className = element.domAttributes.className.replace(/\s{2,}/g, ' ').trim().split(' ').filter(el => !!el.length);

    Object.assign(element.dataAttributes, htmlEl.dataset);

    if (element.dataAttributes.contentType) {
        element.type = element.dataAttributes.contentType;
    }

    element.element = element;

    const style = (element.domAttributes.style = {});
    const styleLen = htmlEl.style.length;
    for (let i = 0; i < styleLen; i++) {
        const domName = htmlEl.style[i]
            .replace(/\-\-/, '') // remove first occurrence of two consecutive hyphens (??)
            .replace(/\-([a-z])/g, match => match[1].toUpperCase()); // convert kebab-case to camelcase
        style[domName] = htmlEl.style[domName];
    }

    if (element.dataAttributes.backgroundImages) {
        const bgImgs = JSON.parse(
            element.dataAttributes.backgroundImages.replace(/\\"/g, '"')
        );
        let backgroundImage = bgImgs.desktop_image || bgImgs.mobile_image;
        smallScreen = smallScreen || window.matchMedia('(max-width: 768px)');
        if (smallScreen.matches && bgImgs.mobile_image) {
            backgroundImage = bgImgs.mobile_image;
        }
        if (backgroundImage) {
            style.backgroundImage = `url('${backgroundImage}')`;
        }
    }

    return element;
};

/**
 * @param {HTMLElement} rootEl
 * @returns {Object}
 */
const walk = (rootEl) => {
    const elementMap = new WeakMap();

    const root = serializeElement(rootEl);
    elementMap.set(rootEl, root.element);

    const tree = document.createTreeWalker(
        rootEl,
        NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT
    );

    let currentNode = tree.nextNode();
    while (currentNode) {
        const isElementNode = currentNode.nodeType === Node.ELEMENT_NODE;
        let element = serializeElement(currentNode);

        elementMap.set(currentNode, element);

        const parentElement = elementMap.get(currentNode.parentNode);
        if (!parentElement) {
            throw new Error(
                'parentElement not found for parent node of',
                currentNode
            );
        }

        const isContentTypeContainer = !!element.type;

        if (isElementNode) {
            const elementName = element.dataAttributes.element;

            if (isContentTypeContainer) {
                element = walk(currentNode);
            } else if (elementName) {
                if (!root.elements[elementName]) {
                    root.elements[elementName] = [];
                }

                root.elements[elementName].push(element);
            }
        }

        parentElement.children.push(element);

        // assign next node
        currentNode = isContentTypeContainer ? tree.nextSibling() : tree.nextNode();
    }

    return root;
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

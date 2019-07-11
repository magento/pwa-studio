const attrToProp = {
    class: 'className',
    allowfullscreen: 'allowFullScreen',
    frameborder: 'frameBorder'
};

let smallScreen;
const makeElement = dom => {
    if (dom.nodeType === Node.TEXT_NODE) {
        return dom.textContent;
    }
    const element = {
        children: [],
        domAttributes: {},
        dataAttributes: {},
        tagName: dom.tagName.toLowerCase()
    };

    for (const attr of dom.attributes) {
        if (attrToProp.hasOwnProperty(attr.name)) {
            element.domAttributes[attrToProp[attr.name]] = attr.value;
        } else if (!(attr.name === 'style' || attr.name.startsWith('data-'))) {
            element.domAttributes[attr.name] = attr.value;
        }
    }

    Object.assign(element.dataAttributes, dom.dataset);

    const style = (element.domAttributes.style = {});
    const styleLen = dom.style.length;
    for (let i = 0; i < styleLen; i++) {
        const domName = dom.style[i]
            .replace(/\-\-/, '')
            .replace(/\-([a-z])/g, match => match[1].toUpperCase());
        style[domName] = dom.style[domName];
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

const makeNode = dom => {
    const element = makeElement(dom);
    const node = {
        element,
        elements: {},
        type: element.dataAttributes.contentType,
        widgets: []
    };
    return node;
};

const walk = rootDom => {
    const elementMap = new WeakMap();

    const root = makeNode(rootDom);
    elementMap.set(rootDom, root.element);

    const tree = document.createTreeWalker(
        rootDom,
        NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT
    );

    let currentNode = tree.nextNode();
    while (currentNode) {
        const isElementNode = currentNode.nodeType === Node.ELEMENT_NODE;
        if (isElementNode && currentNode.dataset.contentType) {
            root.widgets.push(walk(currentNode));
            currentNode = tree.nextSibling();
            continue;
        }

        const element = makeElement(currentNode);
        elementMap.set(currentNode, element);

        const parentElement = elementMap.get(currentNode.parentNode);
        if (!parentElement) {
            throw new Error(
                'parentElement not found for parent node of',
                currentNode
            );
        }
        parentElement.children.push(element);

        if (isElementNode) {
            const elementName = element.dataAttributes.element;
            if (elementName) {
                const theseElements =
                    root.elements[elementName] ||
                    (root.elements[elementName] = []);
                theseElements.push(element);
            }
        }
        currentNode = tree.nextNode();
    }
    return root;
};

const parseStorageHtml = html => {
    const container = document.createElement('div');
    container.innerHTML = html;
    const rootDom = container.querySelector('[data-element="main"]');
    return rootDom ? walk(rootDom) : {};
};

export default parseStorageHtml;

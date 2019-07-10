const isWidget = node => !!node.dataset.contentType;
const makeWidgetsFilter = myParent => ({
    acceptNode(node) {
        const parent = node.parentNode;
        if (parent !== myParent && isWidget(parent)) {
            return NodeFilter.FILTER_REJECT;
        }
        if (isWidget(node)) {
            return NodeFilter.FILTER_ACCEPT;
        }
        return NodeFilter.FILTER_SKIP;
    }
});

const elementsFilter = {
    acceptNode(node) {
        if (isWidget(node)) {
            return NodeFilter.FILTER_REJECT;
        }
        if (node.dataset.element) {
            return NodeFilter.FILTER_ACCEPT;
        }
        return NodeFilter.FILTER_SKIP;
    }
};

const makeElement = dom => {
    const json = {};
    json.domAttributes = {};
    for (const attr of dom.attributes) {
        if (attr.name === 'style' || attr.name.startsWith('data-')) {
            json.domAttributes[attr.name] = attr.value;
        }
    }

    json.dataAttributes = {};
    Object.assign(json.dataAttributes, dom.dataset);

    json.type = json.dataAttributes.contentType;

    json.style = {};
    if (dom.style) {
        Object.assign(json.style, dom.style);
    }

    if (json.dataAttributes.backgroundImages) {
        const bgImgs = JSON.parse(json.dataAttributes.backgroundImages);
        let backgroundImage = bgImgs.desktop_image || bgImgs.mobile_image;
        if (smallScreen.matches && bgImgs.mobile_image) {
            backgroundImage = bgImgs.mobile_image;
        }
        json.domAttributes.style.backgroundImage = `url('${backgroundImage}')`;
    }
};

const walk = dom => {
    const widgets = [];
    const elementMap = new WeakMap();

    const tree = document.createTreeWalker(
        dom,
        NodeFilter.SHOW_ELEMENT & NodeFilter.SHOW_TEXT
    );
    tree.nextNode();

    while (tree.currentNode) {
        if (isWidget(tree.currentNode)) {
            widgets.push(walk(tree.currentNode));
            tree.nextSibling();
            continue;
        }
        if (tree.currentNode.dataset.element) {
            const json = {};
        }
    }
};
const parseStorageHtml = html => {
    const container = document.createElement('div');
    container.innerHTML = html;
    const root = {
        json: { html },
        dom: container.querySelector('[data-element="main"]')
    };
    if (!root.dom) {
        return {};
    }

    const smallScreen = window.matchMedia('(max-width: 768px)');

    const stack = [root];

    let current;
    walk: while ((current = stack.pop())) {
        const { json, dom } = current;

        json.domAttributes = {};
        for (const attr of dom.attributes) {
            if (attr.name === 'style' || attr.name.startsWith('data-')) {
                json.domAttributes[attr.name] = attr.value;
            }
        }

        json.dataAttributes = {};
        Object.assign(current.obj.dataAttributes, current.node.datalist);
        current.obj.type = current.node.datalist.contentType;
        if (current.node.style) {
            Object.assign(current.obj.style, current.node.style);
        }

        if (obj.dataAttributes.backgroundImages) {
            const bgImgs = JSON.parse(obj.dataAttributes.backgroundImages);
            let backgroundImage = bgImgs.desktop_image || bgImgs.mobile_image;
            if (smallScreen.matches && bgImgs.mobile_image) {
                backgroundImage = bgImgs.mobile_image;
            }
            obj.domAttributes.style.backgroundImage = `url('${backgroundImage}')`;
        }
    }
};

export default parseStorageHtml;

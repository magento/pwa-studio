export default (node) => {
    return {
        appearance: node.getAttribute("data-appearance"),
        desktopImage: node.childNodes[0].getAttribute("src"),
        mobileImage: node.childNodes[1].getAttribute("src"),
    }
};

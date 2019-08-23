export default (node) => {
    return {
        appearance: node.getAttribute("data-appearance"),
        enableParallax: node.childNodes[0].getAttribute("data-enable-parallax"),
        // parallaxSpeed: parseInt(innerElement.dataAttributes.parallaxSpeed, 10)
    };
};

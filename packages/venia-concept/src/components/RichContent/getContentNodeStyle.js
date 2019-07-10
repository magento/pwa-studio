const getContentNodeStyle = node => {
    const style = {};
    Object.entries(node.style).forEach(([prop, value]) => {
        style[camelize(prop)] = value;
    });
    return style;
};

export default getContentNodeStyle;

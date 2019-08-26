export default (node, props) => {
    return {
        appearance: props.appearance,
        display: node.style.display,
    };
};

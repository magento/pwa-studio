import { getAdvanced, getBackgroundImages } from '../../utils';

export default (node, props) => {
    // Determine which node holds the data for the appearance
    const dataNode = props.appearance === 'poster' ? node.childNodes[0] : node;
    return {
        appearance: props.appearance,
        // minHeight: dataNode.style.minHeight ? dataNode.style.minHeight : null,
        backgroundColor: dataNode.style.backgroundColor
            ? dataNode.style.backgroundColor
            : null,
        ...getBackgroundImages(dataNode),
        ...getAdvanced(dataNode)
    };
};

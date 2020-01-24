import {
    getAdvanced,
    getBackgroundImages,
    getVerticalAlignment,
    getIsHidden
} from '../../utils';

export default (node, props) => {
    // Determine which node holds the data for the appearance
    const dataNode =
        props.appearance === 'contained' ? node.childNodes[0] : node;
    return {
        minHeight: dataNode.style.minHeight ? dataNode.style.minHeight : null,
        ...getVerticalAlignment(dataNode),
        backgroundColor: dataNode.style.backgroundColor
            ? dataNode.style.backgroundColor
            : null,
        ...getBackgroundImages(dataNode),
        enableParallax: dataNode.getAttribute('data-enable-parallax') === '1',
        parallaxSpeed: parseFloat(dataNode.getAttribute('data-parallax-speed')),
        ...getAdvanced(dataNode),
        ...getIsHidden(node)
    };
};

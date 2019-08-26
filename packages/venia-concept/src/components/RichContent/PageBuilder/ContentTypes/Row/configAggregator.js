import {getAdvanced, getBackgroundImages, getVerticalAlignment} from '../../utils';

export default (node, props) => {
    // Determine which node holds the data for the appearance
    const dataNode = props.appearance === 'contained' ? node.childNodes[0] : node;
    return {
        minHeight: dataNode.style.minHeight ? dataNode.style.minHeight : null,
        ...getVerticalAlignment(dataNode),
        backgroundColor: dataNode.style.backgroundColor,
        ...getBackgroundImages(dataNode),
        enableParallax: dataNode.getAttribute('data-enable-parallax') === "1",
        parallaxSpeed: parseFloat(
            dataNode.getAttribute('data-parallax-speed')
        ),
        ...getAdvanced(dataNode),
    };
};

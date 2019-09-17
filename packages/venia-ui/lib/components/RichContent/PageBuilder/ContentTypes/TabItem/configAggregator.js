import {
    getAdvanced,
    getBackgroundImages,
    getVerticalAlignment
} from '../../utils';

export default node => {
    return {
        textAlign: node.style.textAlign,
        display: node.style.display,
        width: node.style.width,
        justifyContent: node.style.justifyContent,
        flexDirection: node.style.flexDirection,
        alignSelf: node.style.alignSelf,
        ...getVerticalAlignment(node),
        ...getBackgroundImages(node),
        cssClasses: node.getAttribute('class')
            ? node.getAttribute('class')
            : null,
        ...getAdvanced(node)
    };
};

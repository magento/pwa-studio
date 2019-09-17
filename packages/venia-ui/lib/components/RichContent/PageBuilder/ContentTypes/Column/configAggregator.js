import {
    getAdvanced,
    getBackgroundImages,
    getVerticalAlignment
} from '../../utils';

export default node => {
    return {
        minHeight: node.style.minHeight ? node.style.minHeight : null,
        textAlign: node.style.textAlign,
        display: node.style.display,
        width: node.style.width,
        ...getVerticalAlignment(node),
        backgroundColor: node.style.backgroundColor,
        ...getBackgroundImages(node),
        cssClasses: node.getAttribute('class')
            ? node.getAttribute('class')
            : null,
        ...getAdvanced(node)
    };
};

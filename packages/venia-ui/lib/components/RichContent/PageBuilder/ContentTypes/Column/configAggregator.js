import {
    getAdvanced,
    getBackgroundImages,
    getBorder,
    getCssClasses,
    getMargin,
    getTextAlign,
    getVerticalAlignment
} from '../../utils';

export default node => {
    return {
        minHeight: node.style.minHeight ? node.style.minHeight : null,
        display: node.style.display,
        width: node.style.width,
        backgroundColor: node.style.backgroundColor,
        ...getAdvanced(node),
        ...getBackgroundImages(node),
        ...getBorder(node),
        ...getCssClasses(node),
        ...getMargin(node),
        ...getTextAlign(node),
        ...getVerticalAlignment(node)
    };
};

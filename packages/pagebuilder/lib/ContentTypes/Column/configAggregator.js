import {
    getAdvanced,
    getBackgroundImages,
    getVerticalAlignment,
    getMediaQueries
} from '../../utils';

export default node => {
    return {
        minHeight: node.style.minHeight ? node.style.minHeight : null,
        display: node.style.display,
        width: node.style.width,
        backgroundColor: node.style.backgroundColor,
        ...getMediaQueries(node),
        ...getAdvanced(node),
        ...getBackgroundImages(node),
        ...getVerticalAlignment(node)
    };
};

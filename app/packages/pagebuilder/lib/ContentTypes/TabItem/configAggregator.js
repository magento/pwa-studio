import {
    getAdvanced,
    getBackgroundImages,
    getVerticalAlignment,
    getMediaQueries
} from '../../utils';

export default node => {
    return {
        tabName: node.getAttribute('data-tab-name'),
        minHeight: node.style.minHeight,
        ...getVerticalAlignment(node),
        backgroundColor: node.style.backgroundColor,
        ...getBackgroundImages(node),
        ...getAdvanced(node),
        ...getMediaQueries(node)
    };
};

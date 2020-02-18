import {
    getBorder,
    getCssClasses,
    getIsHidden,
    getMargin,
    getPadding,
    getTextAlign
} from '../../utils';

export default node => {
    const iframe = node.querySelector('iframe');
    const wrapper = node.querySelector('[data-element="wrapper"]');

    return {
        url: iframe ? iframe.getAttribute('src') || null : null,
        maxWidth: node.childNodes[0].style.maxWidth || null,
        ...getTextAlign(node),
        ...getMargin(node),
        ...getBorder(wrapper),
        ...getPadding(wrapper),
        ...getCssClasses(node),
        ...getIsHidden(node)
    };
};

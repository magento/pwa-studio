import {getMargin, getBackgroundImages, getBorder, getPadding} from '../../utils';

export default (node, props) => {
    console.log(props.appearance, node);
    const wrapper = node.querySelector('[data-element="wrapper"]');
    const overlay = node.querySelector('[data-element="overlay"]');
    const response = {
        minHeight: overlay.style.minHeight ? overlay.style.minHeight : null,
        content: node.querySelector('[data-element="content"]').innerHTML,
        showButton: node.getAttribute('data-show-button'),
        showOverlay: node.getAttribute('data-show-overlay'),
        ...getBackgroundImages(wrapper),
        ...getBorder(wrapper),
        ...getMargin(node),
        ...getPadding(overlay),
    };
    console.log(response);
    return response;
};

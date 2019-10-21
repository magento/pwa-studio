import {
    getBorder,
    getCssClasses,
    getIsHidden,
    getMargin,
    getPadding,
    getTextAlign
} from '../../utils';

export default node => {
    if (!node.childNodes[0]) {
        return {};
    }

    const imageNode =
        node.childNodes[0].nodeName === 'A'
            ? node.childNodes[0].childNodes
            : node.childNodes;

    const props = {
        desktopImage: imageNode[0] ? imageNode[0].getAttribute('src') : null,
        mobileImage: imageNode[1] ? imageNode[1].getAttribute('src') : null,
        altText: imageNode[0] ? imageNode[0].getAttribute('alt') : null,
        title: imageNode[0] ? imageNode[0].getAttribute('title') : null,
        openInNewTab: node.childNodes[0].getAttribute('target') === '_blank',
        ...getPadding(node),
        ...getMargin(node),
        ...(imageNode[0] ? getBorder(imageNode[0]) : []),
        ...getCssClasses(node),
        ...getTextAlign(node),
        ...getIsHidden(node)
    };
    if (props.desktopImage === props.mobileImage) {
        props.mobileImage = null;
    }
    if (node.childNodes[0].nodeName === 'A') {
        props.link = node.childNodes[0].getAttribute('href');
        props.linkType = node.childNodes[0].getAttribute('data-link-type');
    }
    const captionElement = node.querySelector('figcaption');
    if (captionElement) {
        props.caption = captionElement.textContent;
    }
    return props;
};

import {getBorder, getCssClasses, getMargin, getPadding, getTextAlign} from "../../utils";

export default node => {
    const imageNode = node.childNodes[0].nodeName === 'A' ? node.childNodes[0].childNodes : node.childNodes;
    const props = {
        desktopImage: imageNode[0].getAttribute('src'),
        mobileImage: imageNode[1].getAttribute('src'),
        altText: imageNode[0].getAttribute('alt'),
        title: imageNode[0].getAttribute('title'),
        ...getPadding(node),
        ...getMargin(node),
        ...getBorder(node.childNodes[0]),
        ...getCssClasses(node),
        ...getTextAlign(node),
    };
    if (props.desktopImage === props.mobileImage) {
        props.mobileImage = null;
    }
    if (node.childNodes[0].nodeName === 'A') {
        props.link = node.childNodes[0].getAttribute('href');
    }
    const captionElement = node.querySelector('figcaption');
    if (captionElement) {
        props.caption = captionElement.innerText;
    }
    return props;
};

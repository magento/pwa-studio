import { getBackgroundImages, getVerticalAlignment } from '../../utils';

export default node => {
    console.log(node);
    return {
        minHeight: node.childNodes[0].style.minHeight ? node.childNodes[0].style.minHeight : null,
        ...getVerticalAlignment(node.childNodes[0]),
        backgroundColor: node.childNodes[0].style.backgroundColor,
        ...getBackgroundImages(node.childNodes[0]),
        enableParallax: node.childNodes[0].getAttribute('data-enable-parallax') === "1",
        parallaxSpeed: parseFloat(
            node.childNodes[0].getAttribute('data-parallax-speed')
        ),
        cssClasses: node.childNodes[0].getAttribute('class'),
        border: node.childNodes[0].style.borderStyle,
        borderColor: node.childNodes[0].style.borderColor,
        borderWidth: node.childNodes[0].style.borderWidth,
        borderRadius: node.childNodes[0].style.borderRadius,
        marginTop: node.childNodes[0].style.marginTop,
        marginRight: node.childNodes[0].style.marginRight,
        marginBottom: node.childNodes[0].style.marginBottom,
        marginLeft: node.childNodes[0].style.marginLeft,
        paddingTop: node.childNodes[0].style.paddingTop,
        paddingRight: node.childNodes[0].style.paddingRight,
        paddingBottom: node.childNodes[0].style.paddingBottom,
        paddingLeft: node.childNodes[0].style.paddingLeft,
    };
};

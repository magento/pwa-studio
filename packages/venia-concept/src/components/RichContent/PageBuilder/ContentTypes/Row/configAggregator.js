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
    };
};

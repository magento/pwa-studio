import { getBackgroundImages, getVerticalAlignment } from '../../utils';

export default node => {
    console.log(node);
    return {
        enableParallax: node.childNodes[0].getAttribute('data-enable-parallax'),
        parallaxSpeed: parseFloat(
            node.childNodes[0].getAttribute('data-parallax-speed')
        ),
        ...getVerticalAlignment(node.childNodes[0]),
        ...getBackgroundImages(node.childNodes[0])
    };
};

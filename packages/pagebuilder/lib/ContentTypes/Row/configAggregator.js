import {
    getAdvanced,
    getBackgroundImages,
    getVerticalAlignment,
    getPadding,
    getIsHidden
} from '../../utils';

export default (node, props) => {
    // Determine which node holds the data for the appearance
    const dataNode =
        props.appearance === 'contained' ? node.querySelector('[data-element="inner"]') : node;
    const paddingNode =
        props.appearance === 'full-width' || props.appearance === 'contained'
            ? node.querySelector('[data-element="inner"]')
            : node;
    const videoOverlayNode = node.querySelector('[data-element="video_overlay"]');

    return {
        minHeight: dataNode.style.minHeight ? dataNode.style.minHeight : null,
        ...getVerticalAlignment(dataNode),
        backgroundColor: dataNode.style.backgroundColor
            ? dataNode.style.backgroundColor
            : null,
        ...getBackgroundImages(dataNode),
        enableParallax: dataNode.getAttribute('data-enable-parallax') === '1',
        parallaxSpeed: parseFloat(dataNode.getAttribute('data-parallax-speed')),
        backgroundType: dataNode.getAttribute('data-background-type'),
        videoSrc: dataNode.getAttribute('data-video-src'),
        videoFallbackSrc: dataNode.getAttribute('data-video-fallback-src'),
        videoLoop: dataNode.getAttribute('data-video-loop') === 'true',
        videoPlayOnlyVisible: dataNode.getAttribute('data-video-play-only-visible') === 'true',
        videoLazyLoading: dataNode.getAttribute('data-video-lazy-load') === 'true',
        videoOverlayColor: videoOverlayNode
            ? videoOverlayNode.getAttribute('data-video-overlay-color')
            : null,
        ...getAdvanced(dataNode),
        ...getPadding(paddingNode),
        ...getIsHidden(node)
    };
};

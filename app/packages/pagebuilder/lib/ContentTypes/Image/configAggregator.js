import {
    getBorder,
    getCssClasses,
    getIsHidden,
    getMargin,
    getPadding,
    getTextAlign,
    getMediaQueries
} from '../../utils';

export default node => {
    if (!node.childNodes[0]) {
        return {};
    }

    const imageNode =
        node.childNodes[0].nodeName === 'A'
            ? node.childNodes[0].childNodes
            : node.childNodes;

    const getImageData = imageNode => {
        let imageDimension = null;
        try {
            imageDimension = JSON.parse(
                imageNode.getAttribute('data-image-dimensions')
            );
        } catch (e) {
            // Do nothing
        }
        return {
            src: imageNode.getAttribute('src'),
            dimensions: imageDimension
        };
    };

    const getImageProps = () => {
        const image = imageNode[0];
        let imageProps = {
            desktopImage: null,
            mobileImage: null,
            altText: null,
            title: null
        };
        if (image) {
            const imageData = getImageData(image);
            if (image.getAttribute('data-element') === 'desktop_image') {
                imageProps.desktopImage = imageData;
                const image2 = imageNode[1];
                if (
                    image2.getAttribute('data-element') === 'mobile_image' &&
                    image2.getAttribute('src') !== imageData.src
                ) {
                    imageProps.mobileImage = getImageData(image2);
                }
            } else {
                // If there is no desktop image
                imageProps.mobileImage = imageData;
            }
            imageProps.altText = image.getAttribute('alt');
            imageProps.title = image.getAttribute('title');
            imageProps = {
                ...imageProps,
                ...getBorder(image)
            };
        }

        return imageProps;
    };

    const props = {
        ...getImageProps(),
        openInNewTab: node.childNodes[0].getAttribute('target') === '_blank',
        ...getPadding(node),
        ...getMargin(node),
        ...(imageNode[0] ? getBorder(imageNode[0]) : []),
        ...getCssClasses(node),
        ...getTextAlign(node),
        ...getIsHidden(node),
        ...getMediaQueries(node)
    };

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

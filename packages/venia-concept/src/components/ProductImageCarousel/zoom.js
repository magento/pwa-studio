import ReactImageMagnify from 'react-image-magnify';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classify from 'src/classify';
import defaultClasses from './zoom.css';
import Hint from './hint';

class Zoom extends Component {
    static propTypes = {
        item: PropTypes.object,
        transparentPlaceholder: PropTypes.string,
        resourceUrl: PropTypes.func.isRequired
    };

    render() {
        const { item, transparentPlaceholder, resourceUrl } = this.props;

        const srcSmall = item.file
            ? resourceUrl(item.file, { type: 'image-product', width: 449 })
            : transparentPlaceholder;

        const srcZoom = item.file
            ? resourceUrl(item.file, { type: 'image-product', width: 1347 })
            : transparentPlaceholder;

        const settings = {
            hintComponent: Hint,
            isHintEnabled: true,
            enlargedImageContainerClassName: defaultClasses.zoomContainer,
            hintTextMouse: 'Mouse over to zoom',
            enlargedImagePosition: 'over',
            smallImage: {
                alt: item.label,
                src: srcSmall,
                width: 449,
                height: 557
            },
            largeImage: {
                alt: item.label,
                src: srcZoom,
                width: 1347,
                height: 1671
            }
        };

        return <ReactImageMagnify {...settings} />;
    }
}
export default classify(defaultClasses)(Zoom);

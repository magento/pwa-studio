import { Component, createElement } from 'react';
import PropTypes from 'prop-types';

import classify from 'src/classify';
import { imagePlaceholderUri } from 'src/constants';
import defaultClasses from './item.css';

const imageWidth = '300';
const imageHeight = '372';

const ItemPlaceholder = ({ children, classes }) => (
    <div className={classes.root_pending}>
        <div className={classes.images_pending}>{children}</div>
        <div className={classes.name_pending} />
        <div className={classes.price_pending} />
    </div>
);

class GalleryItem extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            image: PropTypes.string,
            image_pending: PropTypes.string,
            imagePlaceholder: PropTypes.string,
            imagePlaceholder_pending: PropTypes.string,
            images: PropTypes.string,
            images_pending: PropTypes.string,
            name: PropTypes.string,
            name_pending: PropTypes.string,
            price: PropTypes.string,
            price_pending: PropTypes.string,
            root: PropTypes.string,
            root_pending: PropTypes.string
        }),
        item: PropTypes.shape({
            key: PropTypes.string.isRequired,
            image: PropTypes.string,
            name: PropTypes.string,
            price: PropTypes.string
        }),
        onError: PropTypes.func,
        onLoad: PropTypes.func,
        showImage: PropTypes.bool
    };

    static defaultProps = {
        onError: () => {},
        onLoad: () => {}
    };

    render() {
        const { classes, item } = this.props;

        if (!item) {
            return (
                <ItemPlaceholder classes={classes}>
                    {this.renderImagePlaceholder()}
                </ItemPlaceholder>
            );
        }

        const { name, price } = item;

        return (
            <div className={classes.root}>
                <div className={classes.images}>
                    {this.renderImagePlaceholder()}
                    {this.renderImage()}
                </div>
                <div className={classes.name}>
                    <span>{name}</span>
                </div>
                <div className={classes.price}>
                    <span>{price}</span>
                </div>
            </div>
        );
    }

    renderImagePlaceholder = () => {
        const { classes, item, showImage } = this.props;

        if (showImage) {
            return null;
        }

        const className = item
            ? classes.imagePlaceholder
            : classes.imagePlaceholder_pending;

        return (
            <img
                className={className}
                src={imagePlaceholderUri}
                alt=""
                width={imageWidth}
                height={imageHeight}
            />
        );
    };

    renderImage = () => {
        const { classes, item, showImage } = this.props;

        if (!item) {
            return null;
        }

        const { image, name } = item;
        const className = showImage ? classes.image : classes.image_pending;

        return (
            <img
                className={className}
                src={image}
                alt={name}
                width={imageWidth}
                height={imageHeight}
                onLoad={this.handleLoad}
                onError={this.handleError}
            />
        );
    };

    handleLoad = () => {
        const { item, onLoad } = this.props;

        onLoad(item.key);
    };

    handleError = () => {
        const { item, onError } = this.props;

        onError(item.key);
    };
}

export default classify(defaultClasses)(GalleryItem);

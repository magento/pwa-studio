import { Component, createElement } from 'react';
import { string, number, shape, func, bool } from 'prop-types';
import { Price } from '@magento/peregrine';
import classify from 'src/classify';
import { transparentPlaceholder } from 'src/shared/images';
import { makeProductMediaPath } from 'src/util/makeMediaPath';
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
        classes: shape({
            image: string,
            image_pending: string,
            imagePlaceholder: string,
            imagePlaceholder_pending: string,
            images: string,
            images_pending: string,
            name: string,
            name_pending: string,
            price: string,
            price_pending: string,
            root: string,
            root_pending: string
        }),
        item: shape({
            id: number.isRequired,
            name: string.isRequired,
            small_image: string.isRequired,
            price: shape({
                regularPrice: shape({
                    amount: shape({
                        value: number.isRequired,
                        currency: string.isRequired
                    }).isRequired
                }).isRequired
            }).isRequired
        }),
        onError: func,
        onLoad: func,
        showImage: bool
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
                    <Price
                        value={price.regularPrice.amount.value}
                        currencyCode={price.regularPrice.amount.currency}
                    />
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
                src={transparentPlaceholder}
                alt=""
                width={imageWidth}
                height={imageHeight}
            />
        );
    };

    /**
     * TODO: Product images are currently broken and pending a fix from the `graphql-ce` project
     * https://github.com/magento/graphql-ce/issues/88
     *
     * When using sample data, which uses symlinks to bypass cache,
     * you can simply prepend /media/catalog/product/, which we will do by
     * default, but allow the env var MAGENTO_BACKEND_PRODUCT_MEDIA_PATH to
     * override.
     */
    renderImage = () => {
        const { classes, item, showImage } = this.props;

        if (!item) {
            return null;
        }

        const { small_image, name } = item;
        const className = showImage ? classes.image : classes.image_pending;

        return (
            <img
                className={className}
                src={makeProductMediaPath(small_image)}
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

        onLoad(item.id);
    };

    handleError = () => {
        const { item, onError } = this.props;

        onError(item.id);
    };
}

export default classify(defaultClasses)(GalleryItem);

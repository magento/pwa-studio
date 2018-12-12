import React, { Component } from 'react';
import {string, number, shape, func, bool, arrayOf} from 'prop-types';
import { Price } from '@magento/peregrine';
import { Link } from 'react-router-dom';
import classify from 'src/classify';
import { transparentPlaceholder } from 'src/shared/images';
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

// TODO: get productUrlSuffix from graphql when it is ready
const productUrlSuffix = '.html';

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
            small_image: shape(
                shape({
                    url: string,
                    label: string
                })
            ),
            url_key: string.isRequired,
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

        const { name, price, url_key } = item;
        const productLink = `/${url_key}${productUrlSuffix}`;

        return (
            <div className={classes.root}>
                <Link to={productLink} className={classes.images}>
                    {this.renderImagePlaceholder()}
                    {this.renderImage()}
                </Link>
                <Link to={productLink} className={classes.name}>
                    <span>{name}</span>
                </Link>
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

    get imageLabel() {
        const { small_image, name } = this.props.item;
        if (small_image && small_image.label) {
            return small_image.label;
        } else {
            return name;
        }
    }

    renderImage = () => {
        const { classes, item, showImage, imageLabel } = this.props;

        if (!item) {
            return null;
        }

        const { small_image } = item;
        const className = showImage ? classes.image : classes.image_pending;

        return (
            <img
                className={className}
                src={small_image.url}
                alt={imageLabel}
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

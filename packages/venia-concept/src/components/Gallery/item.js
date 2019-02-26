import React, { Component } from 'react';
import { string, number, shape } from 'prop-types';
import { Link, resourceUrl } from 'src/drivers';
import { Price } from '@magento/peregrine';
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
            small_image: string.isRequired,
            url_key: string.isRequired,
            price: shape({
                regularPrice: shape({
                    amount: shape({
                        value: number.isRequired,
                        currency: string.isRequired
                    }).isRequired
                }).isRequired
            }).isRequired
        })
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
                <Link to={resourceUrl(productLink)} className={classes.images}>
                    {this.renderImagePlaceholder()}
                    {this.renderImage()}
                </Link>
                <Link to={resourceUrl(productLink)} className={classes.name}>
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
        const { classes, item } = this.props;

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
     */
    renderImage = () => {
        const { classes, item } = this.props;

        if (!item) {
            return null;
        }

        const { small_image, name } = item;

        return (
            <img
                className={classes.image}
                src={resourceUrl(small_image, {
                    type: 'image-product',
                    width: imageWidth
                })}
                alt={name}
                width={imageWidth}
                height={imageHeight}
            />
        );
    };
}

export default classify(defaultClasses)(GalleryItem);

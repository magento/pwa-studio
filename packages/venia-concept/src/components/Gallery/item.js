import React, { Component } from 'react';
import { arrayOf, string, number, shape } from 'prop-types';
import { Price } from '@magento/peregrine';
import { Link } from 'react-router-dom';
import classify from 'src/classify';
import { transparentPlaceholder } from 'src/shared/images';
import ResponsiveImage from 'src/components/ResponsiveImage';
import defaultClasses from './item.css';

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
        imageSizeBreakpoints: string,
        imageSourceWidths: arrayOf(number),
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

    static defaultProps = {
        imageSizeBreakpoints: '(min-width: 1024px) 30vw',
        imageSourceWidths: [320]
    };

    /**
     * TODO: Product images are currently broken and pending a fix from the `graphql-ce` project
     * https://github.com/magento/graphql-ce/issues/88
     */
    get image() {
        const {
            classes,
            item,
            imageSizeBreakpoints,
            imageSourceWidths
        } = this.props;

        if (!item) {
            return null;
        }

        const { small_image, name } = item;
        const className = item ? classes.image : classes.image_pending;

        return (
            <ResponsiveImage
                className={className}
                sizes={imageSizeBreakpoints}
                src={small_image}
                type="product"
                alt={name}
                widthOptions={imageSourceWidths}
            />
        );
    }

    get imagePlaceholder() {
        const { classes, imageSizeBreakpoints, item } = this.props;

        const className = item
            ? classes.imagePlaceholder
            : classes.imagePlaceholder_pending;

        return (
            <img
                className={className}
                src={transparentPlaceholder}
                alt=""
                sizes={imageSizeBreakpoints}
            />
        );
    }

    render() {
        const { classes, item } = this.props;

        if (!item) {
            return (
                <ItemPlaceholder classes={classes}>
                    {this.imagePlaceholder}
                </ItemPlaceholder>
            );
        }

        const { name, price, url_key } = item;
        const productLink = `/${url_key}${productUrlSuffix}`;

        return (
            <div className={classes.root}>
                <Link to={productLink} className={classes.images}>
                    {this.imagePlaceholder}
                    {this.image}
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
}

export default classify(defaultClasses)(GalleryItem);

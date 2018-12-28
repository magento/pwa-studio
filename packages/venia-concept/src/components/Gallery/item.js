import React, { Component, Fragment } from 'react';
import { string, number, shape } from 'prop-types';
import { Price } from '@magento/peregrine';
import { Link } from 'react-router-dom';
import classify from 'src/classify';
import { transparentPlaceholder } from 'src/shared/images';
import { makeProductMediaPath } from 'src/util/makeMediaPath';
import defaultClasses from './item.css';
import Image from 'src/components/Image';

const imageWidth = '300';
const imageHeight = '372';
const iconHeight = '32';

// TODO: get productUrlSuffix from graphql when it is ready
const productUrlSuffix = '.html';

class GalleryItem extends Component {
    static propTypes = {
        classes: shape({
            image: string,
            images: string,
            name: string,
            price: string,
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

    // used as an argument for <Image />
    renderImagePlaceholder(props) {
        return (
            <img
                src={transparentPlaceholder}
                alt=""
                width={imageWidth}
                height={imageHeight}
                {...props}
            />
        );
    }

    /**
     * TODO: Product images are currently broken and pending a fix from the `graphql-ce` project
     * https://github.com/magento/graphql-ce/issues/88
     */
    get renderImage() {
        const { classes, item } = this.props;
        const { renderImagePlaceholder } = this;

        return (
            <Fragment>
                <Image
                    className={classes.image}
                    src={makeProductMediaPath(item.small_image)}
                    alt={item.name}
                    iconHeight={iconHeight}
                    placeholder={renderImagePlaceholder}
                />
            </Fragment>
        );
    }

    // Runs before images begin to load
    get imagePreLoad() {
        const { classes } = this.props;
        const { renderImagePlaceholder } = this;
        return (
            <div className={classes.root}>
                <Image
                    className={classes.image}
                    alt="placeholder"
                    src={null}
                    iconHeight={iconHeight}
                    placeholder={renderImagePlaceholder}
                />
                <div className={classes.name_pending} />
                <div className={classes.price_pending} />
            </div>
        );
    }

    render() {
        const { classes, item } = this.props;
        const { imagePreLoad } = this;

        // If no item, return imagePreload
        if (!item) {
            return imagePreLoad;
        }

        const { renderImage } = this;

        const { name, price, url_key } = item;
        const productLink = `/${url_key}${productUrlSuffix}`;

        return (
            <div className={classes.root}>
                <Link to={productLink} className={classes.images}>
                    {renderImage}
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

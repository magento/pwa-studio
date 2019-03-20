import React, { Component, Fragment } from 'react';
import { string, number, shape } from 'prop-types';
import { Link, resourceUrl } from 'src/drivers';
import { Price } from '@magento/peregrine';
import classify from 'src/classify';
import { transparentPlaceholder } from 'src/shared/images';
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
            name: string,
            price: string,
            root: string
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

    get renderImage() {
        const { classes, item } = this.props;
        const { renderImagePlaceholder } = this;

        let name = 'placeholder';
        let small_image;
        if (item) {
            name = item.name;
            small_image = item.small_image;
        }

        return (
            <Fragment>
                <Image
                    className={classes.image}
                    src={resourceUrl(small_image, {
                        type: 'image-product',
                        width: imageWidth
                    })}
                    alt={name}
                    iconHeight={iconHeight}
                    placeholder={renderImagePlaceholder}
                />
            </Fragment>
        );
    }

    render() {
        const { classes, item } = this.props;
        const { renderImage } = this;

        if (!item) {
            return this.renderImage;
        }

        const { name, price, url_key } = item;
        const productLink = `/${url_key}${productUrlSuffix}`;

        return (
            <div className={classes.root}>
                <Link to={resourceUrl(productLink)}>
                    {renderImage}
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
}

export default classify(defaultClasses)(GalleryItem);

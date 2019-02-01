import React, { Component } from 'react';
import { arrayOf, string, shape } from 'prop-types';
import classify from 'src/classify';
import { Link, resourceUrl } from 'src/drivers';
import defaultClasses from './categoryTile.css';

// TODO: get categoryUrlSuffix from graphql storeOptions when it is ready
const categoryUrlSuffix = '.html';

const previewImageSize = 480;

class CategoryTile extends Component {
    static propTypes = {
        item: shape({
            image: string,
            name: string.isRequired,
            productImagePreview: shape({
                items: arrayOf(
                    shape({
                        small_image: string
                    })
                )
            }),
            url_key: string.isRequired
        }).isRequired,
        classes: shape({
            item: string,
            image: string,
            imageWrapper: string,
            name: string
        }).isRequired
    };

    get imagePath() {
        const { image, productImagePreview } = this.props.item;
        const previewProduct = productImagePreview.items[0];
        if (image) {
            return resourceUrl(image, {
                type: 'image-category',
                width: previewImageSize
            });
        } else if (previewProduct) {
            return resourceUrl(previewProduct.small_image, {
                type: 'image-product',
                width: previewImageSize
            });
        } else {
            return null;
        }
    }

    render() {
        const { imagePath, props } = this;
        const { classes, item } = props;

        // interpolation doesn't work inside `url()` for legacy reasons
        // so a custom property should wrap its value in `url()`
        const imageUrl = imagePath ? `url(${imagePath})` : 'none';
        const style = { '--venia-image': imageUrl };

        // render an actual image element for accessibility
        const imagePreview = imagePath ? (
            <img className={classes.image} src={imagePath} alt={item.name} />
        ) : null;

        return (
            <Link
                className={classes.root}
                to={`/${item.url_key}${categoryUrlSuffix}`}
            >
                <span className={classes.imageWrapper} style={style}>
                    {imagePreview}
                </span>
                <span className={classes.name}>{item.name}</span>
            </Link>
        );
    }
}

export default classify(defaultClasses)(CategoryTile);

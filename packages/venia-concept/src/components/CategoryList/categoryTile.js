import React, { Component } from 'react';
import { arrayOf, string, shape } from 'prop-types';
import { Link } from 'react-router-dom';

import classify from 'src/classify';
import defaultClasses from './categoryTile.css';

// TODO: get categoryUrlSuffix from graphql storeOptions when it is ready
const categoryUrlSuffix = '.html';

class CategoryTile extends Component {
    static propTypes = {
        item: shape({
            image: arrayOf(
                shape({
                    url: string,
                    label: string
                })
            ),
            name: string.isRequired,
            productImagePreview: shape({
                items: arrayOf(
                    shape({
                        small_image: shape(
                            shape({
                                url: string
                            })
                        ),
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
            return image.url;
        } else if (previewProduct) {
            return previewProduct.small_image.url;
        } else {
            return null;
        }
    }

    get imageLabel() {
        const { image, name } = this.props.item;
        if (image && image.label) {
            return image.label;
        } else {
            return name;
        }
    }

    render() {
        const { imagePath, imageLabel, props } = this;
        const { classes, item } = props;

        // interpolation doesn't work inside `url()` for legacy reasons
        // so a custom property should wrap its value in `url()`
        const imageUrl = imagePath ? `url(${imagePath})` : 'none';
        const style = { '--venia-image': imageUrl };

        // render an actual image element for accessibility
        const imagePreview = imagePath ? (
            <img className={classes.image} src={imagePath} alt={imageLabel} />
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

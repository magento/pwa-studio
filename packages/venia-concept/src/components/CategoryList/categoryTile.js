import React, { Component } from 'react';
import { arrayOf, string, shape } from 'prop-types';
import { Link } from 'react-router-dom';
import classify from 'src/classify';
import defaultClasses from './categoryTile.css';
import {
    makeCategoryMediaPath,
    makeProductMediaPath
} from 'src/util/makeMediaPath';

// TODO: get categoryUrlSuffix from graphql storeOptions when it is ready
const categoryUrlSuffix = '.html';

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
    get previewImage() {
        const { image, productImagePreview } = this.props.item;
        const previewProduct = productImagePreview.items[0];
        if (image) {
            return makeCategoryMediaPath(image);
        } else if (previewProduct) {
            return makeProductMediaPath(previewProduct.small_image);
        }
    }
    render() {
        const { classes, item } = this.props;
        const imagePath = this.previewImage;
        return (
            <Link
                className={classes.root}
                to={`/${item.url_key}${categoryUrlSuffix}`}
            >
                <span className={classes.imageWrapper}>
                    {imagePath && (
                        <img
                            className={classes.image}
                            src={imagePath}
                            alt={item.name}
                        />
                    )}
                </span>
                <span className={classes.name}>{item.name}</span>
            </Link>
        );
    }
}

export default classify(defaultClasses)(CategoryTile);

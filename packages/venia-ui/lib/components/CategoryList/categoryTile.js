import React from 'react';
import { arrayOf, string, shape } from 'prop-types';
import { mergeClasses } from '../../classify';
import { Link, resourceUrl } from '@magento/venia-drivers';
import defaultClasses from './categoryTile.css';
import { useCategoryTile } from '@magento/peregrine/lib/mixins/CategoryList/useCategoryTile';

const CategoryTile = props => {
    const mixinProps = useCategoryTile({
        item: props.item,
        resourceUrl
    });

    const { imagePath, imageWrapperStyle, itemName, itemUrl } = mixinProps;
    const classes = mergeClasses(defaultClasses, props.classes);

    // render an actual image element for accessibility
    const imagePreview = imagePath ? (
        <img className={classes.image} src={imagePath} alt={itemName} />
    ) : null;

    return (
        <Link className={classes.root} to={itemUrl}>
            <span className={classes.imageWrapper} style={imageWrapperStyle}>
                {imagePreview}
            </span>
            <span className={classes.name}>{itemName}</span>
        </Link>
    );
};

CategoryTile.propTypes = {
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
export default CategoryTile;

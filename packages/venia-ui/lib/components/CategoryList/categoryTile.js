import React from 'react';
import { arrayOf, string, shape } from 'prop-types';
import { mergeClasses } from '../../classify';
import { Link, resourceUrl } from '@magento/venia-drivers';
import defaultClasses from './categoryTile.css';
import { useCategoryTile } from '@magento/peregrine/lib/talons/CategoryList/useCategoryTile';

const CategoryTile = props => {
    const talonProps = useCategoryTile({
        item: props.item
    });

    const { image, item } = talonProps;

    const imagePath = resourceUrl(image.url, {
        type: image.type,
        width: image.width
    });

    // interpolation doesn't work inside `url()` for legacy reasons
    // so a custom property should wrap its value in `url()`
    const imageUrl = imagePath ? `url(${imagePath})` : 'none';
    const imageWrapperStyle = { '--venia-image': imageUrl };

    const classes = mergeClasses(defaultClasses, props.classes);

    // render an actual image element for accessibility
    const imagePreview = imagePath ? (
        <img className={classes.image} src={imagePath} alt={item.name} />
    ) : null;

    return (
        <Link className={classes.root} to={item.url}>
            <span className={classes.imageWrapper} style={imageWrapperStyle}>
                {imagePreview}
            </span>
            <span className={classes.name}>{item.name}</span>
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
    })
};
export default CategoryTile;

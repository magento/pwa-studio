import React from 'react';
import { arrayOf, string, shape } from 'prop-types';
import { mergeClasses } from '../../classify';
import { Link } from '@magento/venia-drivers';
import defaultClasses from './categoryTile.css';
import { useCategoryTile } from '@magento/peregrine/lib/talons/CategoryList/useCategoryTile';
import Image from '../Image';

const CategoryTile = props => {
    const talonProps = useCategoryTile({
        item: props.item
    });

    const { image, item } = talonProps;

    const classes = mergeClasses(defaultClasses, props.classes);

    const previewSizes = '80px';
    const imagePreview = image.url ? (
        <Image
            alt={item.name}
            classes={{ root: classes.image }}
            resource={image.url}
            sizes={previewSizes}
            type={image.type}
        />
    ) : <span className={classes.image_empty} />;

    return (
        <Link className={classes.root} to={item.url}>
            {imagePreview}
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

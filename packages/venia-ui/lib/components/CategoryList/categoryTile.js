import React, { useMemo } from 'react';
import { arrayOf, string, shape } from 'prop-types';
import { Link } from 'react-router-dom';

import { useCategoryTile } from '@magento/peregrine/lib/talons/CategoryList/useCategoryTile';

import { useStyle } from '../../classify';
import Image from '../Image';
import defaultClasses from './categoryTile.css';

const IMAGE_WIDTH = 80;

const CategoryTile = props => {
    const talonProps = useCategoryTile({
        item: props.item
    });

    const { image, item } = talonProps;

    const classes = useStyle(defaultClasses, props.classes);

    const imagePreview = useMemo(() => {
        return image.url ? (
            <Image
                alt={item.name}
                classes={{ image: classes.image, root: classes.imageContainer }}
                resource={image.url}
                type={image.type}
                width={IMAGE_WIDTH}
            />
        ) : (
            <span className={classes.image_empty} />
        );
    }, [
        classes.image,
        classes.image_empty,
        classes.imageContainer,
        image.type,
        image.url,
        item.name
    ]);

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
        imageContainer: string,
        name: string
    })
};
export default CategoryTile;

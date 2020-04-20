import React, { useMemo } from 'react';
import { number, string, shape } from 'prop-types';

import { Link, resourceUrl } from '@magento/venia-drivers';
import { useNoProductsFound } from '@magento/peregrine/lib/talons/RootComponents/Category';

import Image from '../../../components/Image';
import { mergeClasses } from '../../../classify';
import noProductsFound from './noProductsFound.png';
import defaultClasses from './noProductsFound.css';

// TODO: get categoryUrlSuffix from graphql storeOptions when it is ready
const categoryUrlSuffix = '.html';

const NoProductsFound = props => {
    const { recommendedCategories } = useNoProductsFound(props);
    const classes = mergeClasses(defaultClasses, props.classes);

    const categoryItems = useMemo(() => {
        return recommendedCategories.map(category => {
            const uri = resourceUrl(
                `/${category.url_path}${categoryUrlSuffix}`
            );

            return (
                <li key={category.id} className={classes.listItem}>
                    <Link to={uri}>{category.name}</Link>
                </li>
            );
        });
    }, [classes, recommendedCategories]);

    return (
        <div className={classes.root}>
            <Image
                alt="Sorry! We couldn't find any products."
                classes={{ image: classes.image, root: classes.imageContainer }}
                src={noProductsFound}
            />
            <h2 className={classes.title}>
                Sorry! We couldn't find any products.
            </h2>
            <div className={classes.categories}>
                <p>Try one of these categories</p>
                <ul className={classes.list}>{categoryItems}</ul>
            </div>
        </div>
    );
};

export default NoProductsFound;

NoProductsFound.propTypes = {
    categoryId: number,
    classes: shape({
        root: string,
        title: string,
        list: string,
        categories: string,
        listItem: string,
        image: string,
        imageContainer: string
    })
};

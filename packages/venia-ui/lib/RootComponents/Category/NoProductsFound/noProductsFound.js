import React from 'react';
import { string, shape, objectOf, number } from 'prop-types';
import { mergeClasses } from '../../../classify';
import { Link, resourceUrl } from '@magento/venia-drivers';
import defaultClasses from './noProductsFound.css';

const NoProductsFound = props => {
    const classes = mergeClasses(defaultClasses, props.classes);
    const categories = props.categories;

    // TODO: get categoryUrlSuffix from graphql storeOptions when it is ready
    const categoryUrlSuffix = '.html';

    const categoryList = (
        <ul className={classes.list}>
            {Object.values(categories)
                .filter(category => category.isActive)
                .map(category => {
                    const uri = resourceUrl(
                        `/${category.urlKey}${categoryUrlSuffix}`
                    );

                    return (
                        <li key={category.id} className={classes.listItem}>
                            <Link to={uri}>{category.name}</Link>
                        </li>
                    );
                })}
        </ul>
    );

    return (
        <div className={classes.root}>
            <img src={''} alt="Sorry! There are no products in this category" />
            <h2 className={classes.title}>
                Sorry! There are no products in this category
            </h2>
            <div className={classes.categories}>
                <p>Try one of these categories</p>
                {categoryList}
            </div>
        </div>
    );
};

export default NoProductsFound;

NoProductsFound.propTypes = {
    classes: shape({
        root: string,
        title: string,
        list: string,
        categories: string,
        listItem: string
    }),
    categories: objectOf(
        shape({
            name: string.isRequired,
            id: number.isRequired
        })
    ).isRequired
};

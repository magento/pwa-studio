import React from 'react';
import { FormattedMessage } from 'react-intl';
import { string, number, shape } from 'prop-types';
import { useCategoryList } from '@magento/peregrine/lib/talons/CategoryList/useCategoryList';

import { mergeClasses } from '../../classify';
import { fullPageLoadingIndicator } from '../LoadingIndicator';
import defaultClasses from './categoryList.css';
import CategoryTile from './categoryTile';

// map Magento 2.3.1 schema changes to Venia 2.0.0 proptype shape to maintain backwards compatibility
const mapCategory = categoryItem => {
    const { items } = categoryItem.productImagePreview;
    return {
        ...categoryItem,
        productImagePreview: {
            items: items.map(item => {
                const { small_image } = item;
                return {
                    ...item,
                    small_image:
                        typeof small_image === 'object'
                            ? small_image.url
                            : small_image
                };
            })
        }
    };
};

const CategoryList = props => {
    const { id, title } = props;
    const talonProps = useCategoryList({ id });
    const { childCategories, error, loading } = talonProps;

    const classes = mergeClasses(defaultClasses, props.classes);

    const header = title ? (
        <div className={classes.header}>
            <h2 className={classes.title}>
                <span>{title}</span>
            </h2>
        </div>
    ) : null;

    let child;

    // TODO: Actually handle errors; the logic below will never allow this to render
    if (error) {
        child = (
            <div className={classes.fetchError}>
                <FormattedMessage
                    id={'categoryList.errorFetch'}
                    defaultMessage={'Data Fetch Error: '}
                />
                <pre>{error.message}</pre>
            </div>
        );
    }

    if (loading || !childCategories) {
        child = fullPageLoadingIndicator;
    } else if (childCategories.length === 0) {
        child = (
            <div className={classes.noResults}>
                <FormattedMessage
                    id={'categoryList.noResults'}
                    defaultMessage={'No child categories found.'}
                />
            </div>
        );
    } else {
        child = (
            <div className={classes.content}>
                {childCategories.map(item => (
                    <CategoryTile item={mapCategory(item)} key={item.url_key} />
                ))}
            </div>
        );
    }

    return (
        <div className={classes.root}>
            {header}
            {child}
        </div>
    );
};

CategoryList.propTypes = {
    id: number.isRequired,
    title: string,
    classes: shape({
        root: string,
        header: string,
        content: string
    })
};

export default CategoryList;

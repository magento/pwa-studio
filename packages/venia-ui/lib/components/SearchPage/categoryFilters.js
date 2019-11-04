import React from 'react';
import { X as CloseIcon } from 'react-feather';
import { useCategoryFilters } from '@magento/peregrine/lib/talons/SearchPage/useCategoryFilters';

import { mergeClasses } from '../../classify';
import Icon from '../../components/Icon';
import GET_CATEGORY_NAME from '../../queries/getCategoryName.graphql';
import defaultClasses from './categoryFilters.css';

const CategoryFilters = props => {
    const { categoryId, executeSearch } = props;
    const talonProps = useCategoryFilters({
        categoryId,
        executeSearch,
        query: GET_CATEGORY_NAME
    });
    const { handleClearCategoryFilter, queryResult } = talonProps;
    const classes = mergeClasses(defaultClasses, props.classes);

    return (
        <div className={classes.root}>
            <button
                className={classes.filter}
                onClick={handleClearCategoryFilter}
            >
                <small className={classes.text}>{queryResult}</small>
                <Icon
                    src={CloseIcon}
                    attrs={{
                        width: '13px',
                        height: '13px'
                    }}
                />
            </button>
        </div>
    );
};

export default CategoryFilters;

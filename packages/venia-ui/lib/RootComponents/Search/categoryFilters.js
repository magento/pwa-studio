import React, { useCallback } from 'react';
import { X as CloseIcon } from 'react-feather';
import { useQuery } from '@apollo/react-hooks';

import { mergeClasses } from '../../classify';
import Icon from '../../components/Icon';
import GET_CATEGORY_NAME from '../../queries/getCategoryName.graphql';
import getQueryParameterValue from '../../util/getQueryParameterValue';
import defaultClasses from './categoryFilters.css';

const CategoryFilters = props => {
    const { categoryId, executeSearch, history, location } = props;
    const classes = mergeClasses(defaultClasses, props.classes);

    const handleClearCategoryFilter = useCallback(() => {
        const inputText = getQueryParameterValue({
            location,
            queryParameter: 'query'
        });

        if (inputText) {
            executeSearch(inputText, history);
        }
    }, [executeSearch, history, location]);

    const { loading, error, data } = useQuery(GET_CATEGORY_NAME, {
        variables: { id: categoryId }
    });

    let queryResult;
    if (loading) queryResult = 'Loading...';
    else if (error) queryResult = null;
    else queryResult = data.category.name;

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

import React, { useCallback } from 'react';
import { X as CloseIcon } from 'react-feather';
import gql from 'graphql-tag';
import { Query } from '@magento/venia-drivers';

import { mergeClasses } from '../../classify';
import Icon from '../../components/Icon';
import getQueryParameterValue from '../../util/getQueryParameterValue';
import defaultClasses from './categoryFilters.css';

const GET_CATEGORY_NAME = gql`
    query getCategoryName($id: Int!) {
        category(id: $id) {
            name
        }
    }
`;

const CategoryFilters = props => {
    const { categoryId, executeSearch, history, location } = props;
    const classes = mergeClasses(defaultClasses, props.classes);

    const renderResult = useCallback(resultProps => {
        const { data, error, loading } = resultProps;

        if (error) return null;
        if (loading) return 'Loading...';
        return data.category.name;
    }, []);

    const handleClearCategoryFilter = useCallback(() => {
        const inputText = getQueryParameterValue({
            location,
            queryParameter: 'query'
        });

        if (inputText) {
            executeSearch(inputText, history);
        }
    }, [executeSearch, history, location]);

    return (
        <div className={classes.root}>
            <button
                className={classes.filter}
                onClick={handleClearCategoryFilter}
            >
                <small className={classes.text}>
                    <Query
                        query={GET_CATEGORY_NAME}
                        variables={{ id: categoryId }}
                    >
                        {renderResult}
                    </Query>
                </small>
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

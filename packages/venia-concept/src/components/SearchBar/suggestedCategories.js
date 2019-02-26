import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classify from 'src/classify';
import { Link } from 'src/drivers';
import { List } from '@magento/peregrine';
import defaultClasses from './suggestedCategories.css';

class SuggestedCategories extends Component {
    static propTypes = {
        handleCategorySearch: PropTypes.func.isRequired,
        autocompleteQuery: PropTypes.string.isRequired,
        classes: PropTypes.shape({
            root: PropTypes.string,
            item: PropTypes.string
        }),
        categorySuggestions: PropTypes.arrayOf(
            PropTypes.shape({
                value_string: PropTypes.string,
                label: PropTypes.string
            })
        ).isRequired
    };

    render() {
        const {
            handleCategorySearch,
            classes,
            autocompleteQuery,
            categorySuggestions
        } = this.props;

        return (
            <List
                render="ul"
                className={classes.root}
                items={categorySuggestions}
                getItemKey={item => item.value_string}
                renderItem={({ item }) => (
                    <li className={classes.item}>
                        <Link
                            onClick={handleCategorySearch}
                            data-id={item.value_string}
                            to="/search.html"
                        >
                            <strong>{autocompleteQuery}</strong> in {item.label}
                        </Link>
                    </li>
                )}
            />
        );
    }
}

export default classify(defaultClasses)(SuggestedCategories);

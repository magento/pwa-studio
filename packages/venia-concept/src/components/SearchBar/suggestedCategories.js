import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classify from 'src/classify';
import { Link } from 'react-router-dom';
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
                id: PropTypes.number,
                url_key: PropTypes.string,
                name: PropTypes.string
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
                getItemKey={item => item.id}
                renderItem={({ item }) => (
                    <li className={classes.item}>
                        <Link
                            onClick={handleCategorySearch}
                            data-id={`${item.id}`}
                            to={item.url_key}
                        >
                            <strong>{autocompleteQuery}</strong> in {item.name}
                        </Link>
                    </li>
                )}
            />
        );
    }
}

export default classify(defaultClasses)(SuggestedCategories);

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classify from 'src/classify';
import { Link } from 'react-router-dom';
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
            <ul className={classes.root}>
                {categorySuggestions.map(category => (
                    <li className={classes.item} key={category.id}>
                        <Link
                            onClick={handleCategorySearch}
                            data-id={`${category.id}`}
                            to={category.url_key}
                        >
                            <strong>{autocompleteQuery}</strong> in{' '}
                            {category.name}
                        </Link>
                    </li>
                ))}
            </ul>
        );
    }
}

export default classify(defaultClasses)(SuggestedCategories);

import React from 'react';
import classify from 'src/classify';
import { Link } from 'react-router-dom';
import defaultClasses from './suggestedCategories.css';

const SuggestedCategories = ({
    handleCategorySearch,
    classes,
    searchQuery,
    categorySuggestions
}) => (
    <ul className={classes.root}>
        {categorySuggestions.map(category => (
            <li className={classes.item} key={category.id}>
                <Link
                    onClick={handleCategorySearch}
                    data-id={`${category.id}`}
                    to={category.url_key}
                >
                    <strong>{searchQuery}</strong> in {category.name}
                </Link>
            </li>
        ))}
    </ul>
);

export default classify(defaultClasses)(SuggestedCategories);

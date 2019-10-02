import React from 'react';
import { func, shape, string } from 'prop-types';
import { Link } from '@magento/venia-drivers';
import { useSuggestedCategory } from '@magento/peregrine/lib/talons/SearchBar';

import { mergeClasses } from '../../classify';
import defaultClasses from './suggestedCategory.css';

const SuggestedCategory = props => {
    const { categoryId, label, onNavigate, value } = props;
    const talonProps = useSuggestedCategory({
        categoryId,
        onNavigate,
        searchValue: value
    });
    const { destination, handleClick } = talonProps;
    const classes = mergeClasses(defaultClasses, props.classes);

    return (
        <Link className={classes.root} to={destination} onClick={handleClick}>
            <strong className={classes.value}>{value}</strong>
            <span className={classes.label}>{` in ${label}`}</span>
        </Link>
    );
};

export default SuggestedCategory;

SuggestedCategory.propTypes = {
    categoryId: string,
    classes: shape({
        label: string,
        root: string,
        value: string
    }),
    label: string.isRequired,
    onNavigate: func,
    value: string.isRequired
};

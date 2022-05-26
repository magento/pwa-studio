import React from 'react';
import { FormattedMessage } from 'react-intl';
import { func, shape, string } from 'prop-types';
import { Link } from 'react-router-dom';
import { useSuggestedCategory } from '@magento/peregrine/lib/talons/SearchBar';

import { useStyle } from '../../classify';
import defaultClasses from './suggestedCategory.module.css';

const SuggestedCategory = props => {
    const { categoryId, label, onNavigate, value } = props;
    const talonProps = useSuggestedCategory({
        categoryId,
        label,
        onNavigate,
        searchValue: value
    });
    const { destination, handleClick } = talonProps;
    const classes = useStyle(defaultClasses, props.classes);

    return (
        <Link className={classes.root} to={destination} onClick={handleClick}>
            <strong className={classes.value}>{value}</strong>
            <span className={classes.label}>
                <FormattedMessage
                    id={'searchBar.label'}
                    defaultMessage={' in {label}'}
                    values={{
                        label
                    }}
                />
            </span>
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

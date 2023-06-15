import React from 'react';
import { func, number, shape, string } from 'prop-types';
import { useCategoryBranch } from '@magento/peregrine/lib/talons/CategoryTree';

import { useStyle } from '../../classify';
import defaultClasses from './categoryBranch.module.css';

const Branch = props => {
    const { category, setCategoryId, tabIndex } = props;
    const { name } = category;
    const classes = useStyle(defaultClasses, props.classes);

    const talonProps = useCategoryBranch({ category, setCategoryId });
    const { exclude, handleClick } = talonProps;

    if (exclude) {
        return null;
    }

    return (
        <li className={classes.root}>
            <button
                tabIndex={tabIndex}
                className={classes.target}
                data-cy="CategoryTree-Branch-target"
                type="button"
                onClick={handleClick}
            >
                <span className={classes.text}>{name}</span>
            </button>
        </li>
    );
};

export default Branch;

Branch.propTypes = {
    category: shape({
        uid: string.isRequired,
        include_in_menu: number,
        name: string.isRequired
    }).isRequired,
    classes: shape({
        root: string,
        target: string,
        text: string
    }),
    setCategoryId: func.isRequired,
    tabIndex: string
};

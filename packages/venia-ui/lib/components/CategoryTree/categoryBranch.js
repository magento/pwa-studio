import React, { useCallback } from 'react';
import { func, number, shape, string } from 'prop-types';

import { mergeClasses } from '../../classify';
import defaultClasses from './categoryBranch.css';

const Branch = props => {
    const { category, setCategoryId } = props;
    const { id, include_in_menu, name } = category;
    const classes = mergeClasses(defaultClasses, props.classes);

    const handleClick = useCallback(() => {
        setCategoryId(id);
    }, [id, setCategoryId]);

    // `include_in_menu` is undefined when Magento <= 2.3.1
    if (include_in_menu === 0) {
        return null;
    }

    return (
        <li className={classes.root}>
            <button
                className={classes.target}
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
        id: number.isRequired,
        include_in_menu: number,
        name: string.isRequired,
        parentId: number,
        position: number,
        url_path: string
    }).isRequired,
    setCategoryId: func.isRequired
};

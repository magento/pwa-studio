import React from 'react';
import { func, shape, string } from 'prop-types';
import { useCategoryLeaf } from '@magento/peregrine/lib/talons/CategoryTree';

import { mergeClasses } from '../../classify';
import { Link, resourceUrl } from '../../drivers';
import defaultClasses from './categoryLeaf.css';

const suffix = '.html';

const Leaf = props => {
    const { category, onNavigate } = props;
    const { name, url_path } = category;
    const classes = mergeClasses(defaultClasses, props.classes);
    const { handleClick } = useCategoryLeaf({ onNavigate });
    const destination = resourceUrl(`/${url_path}${suffix}`);

    return (
        <li className={classes.root}>
            <Link
                className={classes.target}
                to={destination}
                onClick={handleClick}
            >
                <span className={classes.text}>{name}</span>
            </Link>
        </li>
    );
};

export default Leaf;

Leaf.propTypes = {
    category: shape({
        name: string.isRequired,
        url_path: string.isRequired
    }).isRequired,
    classes: shape({
        root: string,
        target: string,
        text: string
    }),
    onNavigate: func.isRequired
};

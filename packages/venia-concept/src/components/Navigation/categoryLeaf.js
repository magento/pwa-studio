import React, { useCallback } from 'react';
import { func, number, shape, string } from 'prop-types';

import { mergeClasses } from 'src/classify';
import { Link, resourceUrl } from 'src/drivers';
import defaultClasses from './categoryLeaf.css';

const suffix = '.html';

const Leaf = props => {
    const { category, onNavigate } = props;
    const { name, url_path } = category;
    const classes = mergeClasses(defaultClasses, props.classes);

    const handleClick = useCallback(() => {
        onNavigate();
    }, [onNavigate]);

    return (
        <li className={classes.root}>
            <Link
                className={classes.target}
                to={resourceUrl(`/${url_path}${suffix}`)}
                onClick={handleClick}
            >
                <span className={classes.text}>{`All ${name}`}</span>
            </Link>
        </li>
    );
};

export default Leaf;

Leaf.propTypes = {
    category: shape({
        id: number,
        name: string.isRequired,
        parentId: number,
        position: number,
        url_path: string.isRequired
    }).isRequired,
    onNavigate: func.isRequired
};

import React from 'react';
import { func, shape, string } from 'prop-types';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { useCategoryLeaf } from '@magento/peregrine/lib/talons/CategoryTree';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';

import { useStyle } from '../../classify';
import defaultClasses from './categoryLeaf.module.css';

const Leaf = props => {
    const { category, onNavigate, categoryUrlSuffix, tabIndex } = props;
    const { name, url_path, children } = category;
    const classes = useStyle(defaultClasses, props.classes);
    const { handleClick } = useCategoryLeaf({ onNavigate });
    const destination = resourceUrl(`/${url_path}${categoryUrlSuffix || ''}`);

    const leafLabel =
        children && children.length ? (
            <FormattedMessage
                id={'categoryLeaf.allLabel'}
                defaultMessage={'All {name}'}
                values={{
                    name: name
                }}
            />
        ) : (
            name
        );

    return (
        <li className={classes.root}>
            <Link
                className={classes.target}
                data-cy="CategoryTree-Leaf-target"
                to={destination}
                onClick={handleClick}
                tabIndex={tabIndex}
            >
                <span className={classes.text}>{leafLabel}</span>
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
    onNavigate: func.isRequired,
    tabIndex: string,
    categoryUrlSuffix: string
};

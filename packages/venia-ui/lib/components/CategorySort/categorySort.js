import React, {useMemo, useState} from 'react';
import {Check} from 'react-feather';
import uuidV4 from 'uuid/v4';
import {arrayOf, shape, string, func, oneOf} from 'prop-types';

import defaultClasses from './categorySort.css';
import {mergeClasses} from '../../classify';
import Icon from '../Icon/icon';

const CategorySort = props => {
    const classes = mergeClasses(defaultClasses);
    const {availableSortMethods, sortControl} = props;
    const {currentSort, setSort} = sortControl;

    const [visible, setVisible] = useState(false);
    const [sortAttribute, setSortAttribute] = useState(
        currentSort.sortAttribute
    );
    const [sortDirection, setSortDirection] = useState(
        currentSort.sortDirection
    );

    const sortElements = useMemo(() => {

        const onChildButtonClick = (sortAttribute) => {
            setSort({
                sortAttribute: sortAttribute.attribute,
                sortDirection: sortAttribute.sortDirection
            });
            setVisible(false);
            setSortAttribute(sortAttribute.attribute);
            setSortDirection(sortAttribute.sortDirection);
        };

        if (visible === false) {
            return;
        }

        const sortElements = [];
        for (const element of availableSortMethods) {
            const key = uuidV4();
            sortElements.push(
                <li key={key} className={classes.child}>
                    <button
                        className={classes.childButton}
                        onClick={onChildButtonClick.bind(null, element)}
                    >
                        <span className={classes.childText}>
                            {element.text}
                        </span>
                        {element.attribute === sortAttribute &&
                        element.sortDirection === sortDirection && (
                            <span className={classes.activeIcon}>
                                    <Icon src={Check} size={14}/>
                                </span>
                        )}
                    </button>
                </li>
            );
        }

        return (
            <div className={classes.menu}>
                <ul>{sortElements}</ul>
            </div>
        );
    }, [
        visible,
        classes.menu,
        classes.child,
        classes.childButton,
        classes.activeIcon,
        setSort,
        sortDirection,
        availableSortMethods,
        sortAttribute
    ]);

    const handleSortClick = () => {
        if (visible === true) {
            setVisible(false);
        } else {
            setVisible(true);
        }
    };

    return (
        <div className={classes.root}>
            <button onClick={handleSortClick} className={classes.sortButton}>
                {'Sort'}
            </button>
            {sortElements}
        </div>
    );
};

const sortDirections = oneOf(['ASC', 'DESC']);

CategorySort.propTypes = {
    availableSortMethods: arrayOf(
        shape({
            text: string,
            attribute: string,
            sortDirection: sortDirections
        })
    ),
    sortControl: shape({
        currentSort: shape({
            sortAttribute: string,
            sortDirection: sortDirections
        }),
        setSort: func.isRequired
    })
};

CategorySort.defaultProps = {
    availableSortMethods: [
        {
            text: 'Best Match',
            attribute: 'relevance',
            sortDirection: 'ASC'
        },
        {
            text: 'Price: Low to High',
            attribute: 'price',
            sortDirection: 'ASC'
        },
        {
            text: 'Price: High to Low',
            attribute: 'price',
            sortDirection: 'DESC'
        }
    ]
};

export default CategorySort;

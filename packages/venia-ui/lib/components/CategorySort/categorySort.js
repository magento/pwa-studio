import React, { useMemo, useState } from 'react';
import defaultClasses from './categorySort.css';
import { mergeClasses } from '../../classify';
import Icon from '../Icon/icon';
import { Check, ArrowUp, ArrowDown } from 'react-feather';
import { arrayOf, shape, string, func } from 'prop-types';

const CategorySort = props => {
    const classes = mergeClasses(defaultClasses);
    const [visible, setVisible] = useState(false);
    const { availableSortMethods, sortControl } = props;
    const { currentSort, setSort } = sortControl;
    const [sortAttribute, setSortAttribute] = useState(
        currentSort.sortAttribute
    );
    const [sortDirection, setSortDirection] = useState(
        currentSort.sortDirection
    );

    const sortElements = useMemo(() => {
        function onChildButtonClick(sortAttribute) {
            setSort({
                sortAttribute: sortAttribute,
                sortDirection: sortDirection
            });
            setVisible(false);
            setSortAttribute(sortAttribute);
        }

        if (visible === false) {
            return;
        }

        const sortElements = [];
        for (const element of availableSortMethods) {
            const key = `${element.attribute}`;
            sortElements.push(
                <li key={key} className={classes.child}>
                    <button
                        className={classes.childButton}
                        onClick={onChildButtonClick.bind(
                            null,
                            element.attribute
                        )}
                    >
                        {element.text}
                        {element.attribute === sortAttribute && (
                            <span className={classes.activeIcon}>
                                <Icon src={Check} size={14} />
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

    const sortDirectionElement = useMemo(() => {
        function onClickDirection(sortDirection) {
            setSortDirection(sortDirection);
            setSort({
                sortAttribute: sortAttribute,
                sortDirection: sortDirection
            });
        }

        if (sortDirection === 'ASC') {
            return (
                <button onClick={onClickDirection.bind(null, 'DESC')}>
                    <Icon src={ArrowUp} attrs={{ width: '1.375rem' }} />
                </button>
            );
        } else {
            return (
                <button onClick={onClickDirection.bind(null, 'ASC')}>
                    <Icon src={ArrowDown} attrs={{ width: '1.375rem' }} />
                </button>
            );
        }
    }, [setSort, sortAttribute, sortDirection]);

    function handleSortClick() {
        if (visible === true) {
            setVisible(false);
        } else {
            setVisible(true);
        }
    }

    return (
        <div className={classes.root}>
            <button onClick={handleSortClick} className={classes.sortButton}>
                {'Sort'}
            </button>
            {sortElements}
            {sortDirectionElement}
        </div>
    );
};

CategorySort.propTypes = {
    availableSortMethods: arrayOf(
        shape({
            text: string,
            attribute: string
        })
    ),
    sortControl: shape({
        currentSort: shape({
            setSortDirection: string,
            sortAttribute: string
        }),
        setSort: func.isRequired
    })
};

CategorySort.defaultProps = {
    availableSortMethods: [
        {
            text: 'Name',
            attribute: 'name'
        },
        {
            text: 'Position',
            attribute: 'position'
        },
        {
            text: 'Price',
            attribute: 'price'
        },
        {
            text: 'Relevance',
            attribute: 'relevance'
        }
    ]
};

export default CategorySort;

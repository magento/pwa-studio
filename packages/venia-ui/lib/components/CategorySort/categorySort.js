import React, {useMemo} from 'react';
import defaultClasses from './categorySort.css';
import {mergeClasses} from "../../classify";
import Icon from "../Icon/icon";
import {Check as Checkmark, Check} from "react-feather";

const CategorySort = props => {
    const classes = mergeClasses(defaultClasses);
    const isSelected = true;
    const elements =
        [
            {
                text: 'Newest',
                isActive: false
            },
            {
                text: 'Best Reated',
                isActive: true
            },
            {
                text: 'Best Reated',
                isActive: false
            }
        ];

    const sortElements = useMemo(() => {
        const sortElements = [];
        for (const element of elements) {
            sortElements.push
            (
                <li>
                    <button>
                        {element.text}
                        {element.isActive && <span className={classes.active}><Icon src={Check} size={14}/></span>}
                    </button>
                </li>
            )
        }

        return sortElements;
    });

    return (
        <div className={classes.root}>
            <button className={classes.sortButton}>{'Sort'}</button>
            <div className={classes.menu}>
                <ul>{sortElements}</ul>
            </div>
        </div>
    )
};

export default CategorySort

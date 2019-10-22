import React, { useCallback, useState } from 'react';
import { shape, string } from 'prop-types';
import { ChevronDown as ArrowDown, ChevronUp as ArrowUp } from 'react-feather';
import { Form } from 'informed';

import { mergeClasses } from '../../classify';
import Icon from '../Icon';
import FilterList from './FilterList';
import defaultClasses from './filterBlock.css';

const getFilterType = id => (id === 'fashion_color' ? 'SWATCH' : 'DEFAULT');

const FilterBlock = props => {
    const classes = mergeClasses(defaultClasses, props.classes);
    const { filterApi, filterState, group, items, name } = props;
    const filterType = getFilterType(group);
    const isSwatch = filterType === 'SWATCH';

    const [isExpanded, setExpanded] = useState(false);
    const iconSrc = isExpanded ? ArrowUp : ArrowDown;

    const handleClick = useCallback(() => {
        setExpanded(value => !value);
    }, [setExpanded]);

    const listProps = { filterApi, filterState, group, isSwatch, items, name };
    const listElement = isExpanded ? <FilterList {...listProps} /> : null;

    return (
        <li className={classes.root}>
            <button
                className={classes.trigger}
                onClick={handleClick}
                type="button"
            >
                <span className={classes.header}>
                    <span className={classes.name}>{name}</span>
                    <Icon src={iconSrc} />
                </span>
            </button>
            <Form className={classes.list}>{listElement}</Form>
        </li>
    );
};

export default FilterBlock;

FilterBlock.propTypes = {
    classes: shape({
        header: string,
        list: string,
        name: string,
        root: string,
        trigger: string
    })
};

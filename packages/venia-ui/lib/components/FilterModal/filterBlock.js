import React from 'react';
import { useIntl } from 'react-intl';
import { arrayOf, shape, string } from 'prop-types';
import { ChevronDown as ArrowDown, ChevronUp as ArrowUp } from 'react-feather';
import { Form } from 'informed';
import { useFilterBlock } from '@magento/peregrine/lib/talons/FilterModal';
import setValidator from '@magento/peregrine/lib/validators/set';

import { mergeClasses } from '../../classify';
import Icon from '../Icon';
import FilterList from './FilterList';
import defaultClasses from './filterBlock.css';

const FilterBlock = props => {
    const { filterApi, filterState, group, items, name } = props;
    const { formatMessage } = useIntl();
    const talonProps = useFilterBlock();
    const { handleClick, isExpanded } = talonProps;
    const iconSrc = isExpanded ? ArrowUp : ArrowDown;
    const classes = mergeClasses(defaultClasses, props.classes);
    const listClass = isExpanded
        ? classes.list_expanded
        : classes.list_collapsed;

    const itemAriaLabel = formatMessage(
        {
            id: 'filterModal.item.ariaLabel',
            defaultMessage: 'Filter products by'
        },
        {
            itemName: name
        }
    );

    const toggleItemOptionsAriaLabel = isExpanded
        ? formatMessage(
              {
                  id: 'filterModal.item.hideOptions',
                  defaultMessage: 'Hide filter item options.'
              },
              {
                  itemName: name
              }
          )
        : formatMessage(
              {
                  id: 'filterModal.item.showOptions',
                  defaultMessage: 'Show filter item options.'
              },
              {
                  itemName: name
              }
          );

    return (
        <li className={classes.root} aria-label={itemAriaLabel}>
            <button
                className={classes.trigger}
                onClick={handleClick}
                type="button"
                aria-expanded={isExpanded}
                aria-label={toggleItemOptionsAriaLabel}
            >
                <span className={classes.header}>
                    <span className={classes.name}>{name}</span>
                    <Icon src={iconSrc} />
                </span>
            </button>
            <Form className={listClass}>
                <FilterList
                    filterApi={filterApi}
                    filterState={filterState}
                    group={group}
                    items={items}
                    isExpanded={isExpanded}
                />
            </Form>
        </li>
    );
};

export default FilterBlock;

FilterBlock.propTypes = {
    classes: shape({
        header: string,
        list_collapsed: string,
        list_expanded: string,
        name: string,
        root: string,
        trigger: string
    }),
    filterApi: shape({}).isRequired,
    filterState: setValidator,
    group: string.isRequired,
    items: arrayOf(shape({})),
    name: string.isRequired
};

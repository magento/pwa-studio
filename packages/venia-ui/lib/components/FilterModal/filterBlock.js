import React from 'react';
import { arrayOf, shape, string, func, bool } from 'prop-types';
import { useIntl } from 'react-intl';
import { ChevronDown as ArrowDown, ChevronUp as ArrowUp } from 'react-feather';
import { Form } from 'informed';

import { useFilterBlock } from '@magento/peregrine/lib/talons/FilterModal';
import setValidator from '@magento/peregrine/lib/validators/set';

import { useStyle } from '../../classify';
import Icon from '../Icon';
import FilterList from './FilterList';
import defaultClasses from './filterBlock.module.css';

const FilterBlock = props => {
    const {
        filterApi,
        filterState,
        filterFrontendInput,
        group,
        items,
        name,
        onApply,
        initialOpen
    } = props;

    const { formatMessage } = useIntl();
    const talonProps = useFilterBlock({
        filterState,
        items,
        initialOpen
    });
    const { handleClick, isExpanded } = talonProps;
    const iconSrc = isExpanded ? ArrowUp : ArrowDown;
    const classes = useStyle(defaultClasses, props.classes);

    const itemAriaLabel = formatMessage(
        {
            id: 'filterModal.item.ariaLabel',
            defaultMessage: 'Filter products by "{itemName}"'
        },
        {
            itemName: name
        }
    );

    const toggleItemOptionsAriaLabel = isExpanded
        ? formatMessage(
              {
                  id: 'filterModal.item.hideOptions',
                  defaultMessage: 'Hide "{itemName}" filter item options.'
              },
              {
                  itemName: name
              }
          )
        : formatMessage(
              {
                  id: 'filterModal.item.showOptions',
                  defaultMessage: 'Show "{itemName}" filter item options.'
              },
              {
                  itemName: name
              }
          );

    const list = isExpanded ? (
        <Form className={classes.list}>
            <FilterList
                filterApi={filterApi}
                filterState={filterState}
                name={name}
                filterFrontendInput={filterFrontendInput}
                group={group}
                items={items}
                onApply={onApply}
            />
        </Form>
    ) : null;

    return (
        <li
            className={classes.root}
            aria-label={itemAriaLabel}
            data-cy="FilterBlock-root"
        >
            <button
                className={classes.trigger}
                onClick={handleClick}
                data-cy="FilterBlock-triggerButton"
                type="button"
                aria-expanded={isExpanded}
                aria-label={toggleItemOptionsAriaLabel}
            >
                <span className={classes.header}>
                    <span className={classes.name}>{name}</span>
                    <Icon src={iconSrc} />
                </span>
            </button>
            {list}
        </li>
    );
};

FilterBlock.defaultProps = {
    onApply: null,
    initialOpen: false
};

FilterBlock.propTypes = {
    classes: shape({
        header: string,
        list: string,
        name: string,
        root: string,
        trigger: string
    }),
    filterFrontendInput: string,
    filterApi: shape({}).isRequired,
    filterState: setValidator,
    group: string.isRequired,
    items: arrayOf(shape({})),
    name: string.isRequired,
    onApply: func,
    initialOpen: bool
};

export default FilterBlock;

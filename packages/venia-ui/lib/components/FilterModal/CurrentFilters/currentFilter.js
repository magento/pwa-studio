import React, { useCallback } from 'react';
import { useIntl } from 'react-intl';
import { shape, string, func } from 'prop-types';
import { X as Remove } from 'react-feather';
import { useHistory, useLocation } from 'react-router-dom';

import { useStyle } from '../../../classify';
import Icon from '../../Icon';
import Trigger from '../../Trigger';
import defaultClasses from './currentFilter.module.css';

const CurrentFilter = props => {
    const { group, item, removeItem, onRemove } = props;
    const classes = useStyle(defaultClasses, props.classes);
    const { formatMessage } = useIntl();
    const location = useLocation();
    const history = useHistory();

    const handleClick = useCallback(() => {
        removeItem({ group, item });
        if (typeof onRemove === 'function') {
            onRemove(group, item);
        }

        if (group == 'price') {
            // preserve all existing params
            const params = new URLSearchParams(location.search);
            params.delete('price[filter]');
            history.replace({ search: params.toString() });
        }
    }, [group, item, removeItem, onRemove, history, location.search]);

    const ariaLabel = formatMessage(
        {
            id: 'filterModal.action.clearFilterItem.ariaLabel',
            defaultMessage: 'Clear filter "{name}"'
        },
        {
            name: item.label ? item.label : item.title
        }
    );

    return (
        <span className={classes.root} data-cy="CurrentFilter-root">
            <Trigger
                action={handleClick}
                aria-label={ariaLabel}
                data-cy="CurrentFilter-trigger"
            >
                <Icon size={20} src={Remove} />
            </Trigger>
            <span className={classes.text}>
                {item.label ? item.label : item.title}
            </span>
        </span>
    );
};

export default CurrentFilter;

CurrentFilter.defaultProps = {
    onRemove: null
};

CurrentFilter.propTypes = {
    classes: shape({
        root: string
    }),
    onRemove: func
};

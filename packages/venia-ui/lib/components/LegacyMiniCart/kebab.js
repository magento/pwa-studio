import React from 'react';
import { node, shape, string } from 'prop-types';
import { useIntl } from 'react-intl';
import { MoreVertical as MoreVerticalIcon } from 'react-feather';

import { useStyle } from '../../classify';
import Icon from '../Icon';

import defaultClasses from './kebab.module.css';
import { useKebab } from '@magento/peregrine/lib/talons/LegacyMiniCart/useKebab';

const Kebab = props => {
    const { handleKebabClick, isOpen, kebabRef } = useKebab();
    const { children } = props;
    const classes = useStyle(defaultClasses, props.classes);
    const toggleClass = isOpen ? classes.dropdown_active : classes.dropdown;

    const { formatMessage } = useIntl();
    const ariaLabelExpanded = formatMessage({
        id: 'LegacyMiniCart.buttonExpanded',
        defaultMessage: 'More Options Expanded'
    });
    const ariaLabelCollapsed = formatMessage({
        id: 'LegacyMiniCart.buttonCollapsed',
        defaultMessage: 'More Options Collapsed'
    });

    const result = isOpen ? ariaLabelExpanded : ariaLabelCollapsed;

    return (
        <div className={classes.root}>
            <button
                aria-expanded={isOpen}
                className={classes.kebab}
                data-cy="Kebab-button"
                onClick={handleKebabClick}
                aria-label={result}
                ref={kebabRef}
            >
                <Icon src={MoreVerticalIcon} />
            </button>
            <ul aria-hidden={isOpen ? 'false' : 'true'} className={toggleClass}>
                {children}
            </ul>
        </div>
    );
};

Kebab.propTypes = {
    children: node,
    classes: shape({
        dropdown: string,
        dropdown_active: string,
        kebab: string,
        root: string
    })
};

export default Kebab;

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
    //const result = isOpen ? 'More Options Expanded' : 'More Options Collapsed';

    const { formatMessage } = useIntl();

    return (
        <div className={classes.root}>
            <button
                className={classes.kebab}
                data-cy="Kebab-button"
                onClick={handleKebabClick}
                aria-label={formatMessage({
                    id: 'Kebab.buttonstatus',
                    defaultMessage:
                        'checking for translation taking component value'
                })}
                //aria-label={result}
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

import React from 'react';
import { shape, string } from 'prop-types';
import { User as MyAccountIcon } from 'react-feather';

import { mergeClasses } from '@magento/venia-ui/lib/classify';

import Icon from '../Icon';
import defaultClasses from './cartTrigger.css';

const AccountTrigger = props => {
    const classes = mergeClasses(defaultClasses, props.classes);
    const welcomeMessage = 'Hi, Qadimatronomatic';

    return (
        <button
            aria-label={'Toggle My Account Menu'}
            className={classes.root}
        >
            <Icon src={MyAccountIcon} />
            {welcomeMessage}
        </button>
    );
};

export default AccountTrigger;

AccountTrigger.propTypes = {
    classes: shape({
        root: string
    })
};

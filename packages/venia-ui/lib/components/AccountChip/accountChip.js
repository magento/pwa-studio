import React from 'react';
import { shape, string } from 'prop-types';
import { Loader, User as AccountIcon } from 'react-feather';

import { useAccountChip } from '@magento/peregrine/lib/talons/AccountChip/useAccountChip';
import { mergeClasses } from '@magento/venia-ui/lib/classify';

import Icon from '../Icon';
import defaultClasses from './accountChip.css';

const AccountChip = props => {
    const { fallbackText } = props;

    const talonProps = useAccountChip({ fallbackText });
    const { isLoadingUserName, welcomeMessage } = talonProps;

    const classes = mergeClasses(defaultClasses, props.classes);

    const chipText = isLoadingUserName ? (
        <Icon classes={{ icon: classes.loader }} src={Loader} />
    ) : (
        welcomeMessage
    );

    return (
        <div className={classes.root}>
            <Icon src={AccountIcon} />
            <span className={classes.text}>{chipText}</span>
        </div>
    );
};

export default AccountChip;

AccountChip.propTypes = {
    classes: shape({
        root: string,
        loader: string,
        text: string
    }),
    fallbackText: string
};

AccountChip.defaultProps = {
    fallbackText: 'Account'
};

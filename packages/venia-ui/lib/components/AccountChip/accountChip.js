import React from 'react';
import { bool, shape, string } from 'prop-types';
import { Loader, User as AccountIcon } from 'react-feather';

import { useAccountChip } from '@magento/peregrine/lib/talons/AccountChip/useAccountChip';
import { mergeClasses } from '@magento/venia-ui/lib/classify';

import Icon from '../Icon';
import defaultClasses from './accountChip.css';

const AccountChip = props => {
    const { fallbackText, shouldIndicateLoading } = props;

    const talonProps = useAccountChip();
    const { currentUser, isLoadingUserName, isUserSignedIn } = talonProps;

    const classes = mergeClasses(defaultClasses, props.classes);

    let chipText;
    if (!isUserSignedIn) {
        chipText = fallbackText;
    } else {
        if (!isLoadingUserName) {
            chipText = `Hi, ${currentUser.firstname}`;
        } else if (shouldIndicateLoading) {
            chipText = <Icon classes={{ icon: classes.loader }} src={Loader} />;
        } else {
            chipText = fallbackText;
        }
    }

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
    fallbackText: string,
    shouldIndicateLoading: bool
};

AccountChip.defaultProps = {
    fallbackText: 'Account',
    shouldIndicateLoading: false
};

import React, { Fragment, Suspense } from 'react';
import { useIntl } from 'react-intl';
import { shape, string } from 'prop-types';

import { useAccountTrigger } from '@magento/peregrine/lib/talons/Header/useAccountTrigger';
import { useStyle } from '@magento/venia-ui/lib/classify';

import AccountChip from '../AccountChip';

import defaultClasses from './accountTrigger.module.css';

const AccountMenu = React.lazy(() => import('../AccountMenu'));

/**
 * The AccountTrigger component is the call to action in the site header
 * that toggles the AccountMenu dropdown.
 *
 * @param {Object} props
 * @param {Object} props.classes - CSS classes to override element styles.
 */
const AccountTrigger = props => {
    const talonProps = useAccountTrigger();
    const {
        accountMenuIsOpen,
        accountMenuRef,
        accountMenuTriggerRef,
        setAccountMenuIsOpen,
        handleTriggerClick,
        isUserSignedIn
    } = talonProps;

    const classes = useStyle(defaultClasses, props.classes);
    const rootClassName = accountMenuIsOpen ? classes.root_open : classes.root;
    const { formatMessage } = useIntl();

    const ariaLabelMyMenu = formatMessage({
        id: 'accountTrigger.ariaLabelMyMenu',
        defaultMessage: 'Toggle My Account Menu'
    });
    const ariaLabelSignIn = formatMessage({
        id: 'accountTrigger.ariaLabelSignIn',
        defaultMessage: 'Sign In'
    });
    const ariaLabel = isUserSignedIn ? ariaLabelMyMenu : ariaLabelSignIn;
    return (
        <Fragment>
            <div className={rootClassName} ref={accountMenuTriggerRef}>
                <button
                    aria-label={ariaLabel}
                    aria-expanded={accountMenuIsOpen}
                    className={classes.trigger}
                    onClick={handleTriggerClick}
                    data-cy="AccountTrigger-trigger"
                >
                    <AccountChip
                        fallbackText={formatMessage({
                            id: 'accountTrigger.buttonFallback',
                            defaultMessage: 'Sign In'
                        })}
                        shouldIndicateLoading={true}
                    />
                </button>
            </div>
            <Suspense fallback={null}>
                <AccountMenu
                    handleTriggerClick={handleTriggerClick}
                    ref={accountMenuRef}
                    accountMenuIsOpen={accountMenuIsOpen}
                    setAccountMenuIsOpen={setAccountMenuIsOpen}
                />
            </Suspense>
        </Fragment>
    );
};

export default AccountTrigger;

AccountTrigger.propTypes = {
    classes: shape({
        root: string,
        root_open: string,
        trigger: string
    })
};

import React, { useCallback, useMemo } from 'react';
import { shape } from 'prop-types';
import { withRouter } from '@magento/venia-drivers';
import { compose } from 'redux';
import CreateAccountForm from '../CreateAccount';
import { mergeClasses } from '../../classify';
import defaultClasses from './createAccountPage.css';
import { getCreateAccountInitialValues } from './helpers';
import { useUserContext } from '@magento/peregrine/lib/context/user';

const CreateAccountPage = props => {
    const [, { createAccount }] = useUserContext();
    const classes = mergeClasses(defaultClasses, props.classes);
    const { history } = props;

    const handleCreateAccount = useCallback(
        async accountInfo => {
            await createAccount(accountInfo);
            history.push('/');
        },
        [createAccount, history]
    );

    const initialValues = useMemo(
        () => getCreateAccountInitialValues(window.location.search),
        []
    );

    return (
        <div className={classes.container}>
            <CreateAccountForm
                initialValues={initialValues}
                onSubmit={handleCreateAccount}
            />
        </div>
    );
};

CreateAccountPage.propTypes = {
    initialValues: shape({}),
    history: shape({})
};

export default compose(withRouter)(CreateAccountPage);

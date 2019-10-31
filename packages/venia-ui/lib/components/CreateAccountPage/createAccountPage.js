import React from 'react';
import { shape, string } from 'prop-types';
import { useCreateAccountPage } from '@magento/peregrine/lib/talons/CreateAccountPage/useCreateAccountPage';

import CreateAccountForm from '../CreateAccount';
import { mergeClasses } from '../../classify';
import defaultClasses from './createAccountPage.css';

const CreateAccountPage = props => {
    const talonProps = useCreateAccountPage();
    const { initialValues, handleCreateAccount } = talonProps;
    const classes = mergeClasses(defaultClasses, props.classes);

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
    classes: shape({
        container: string
    }),
    initialValues: shape({})
};

export default CreateAccountPage;

import React from 'react';
import { shape } from 'prop-types';
import { useHistory } from '@magento/venia-drivers';
import CreateAccountForm from '../CreateAccount';
import { mergeClasses } from '../../classify';
import defaultClasses from './createAccountPage.css';
import { useCreateAccountPage } from '@magento/peregrine/lib/talons/CreateAccountPage/useCreateAccountPage';

const CreateAccountPage = props => {
    const history = useHistory();
    const talonProps = useCreateAccountPage({
        history
    });

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
    initialValues: shape({})
};

export default CreateAccountPage;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import Page from 'src/components/Page';
import CreateAccountForm from 'src/components/CreateAccount';
import classify from 'src/classify';
import defaultClasses from './createAccountPage.css';
import { getCreateAccountInitialValues } from './helpers';

class CreateAccountPage extends Component {
    static propTypes = {
        createAccount: PropTypes.func,
        initialValues: PropTypes.shape({}),
        history: PropTypes.shape({})
    };

    createAccount = accountInfo => {
        const { createAccount, history } = this.props;
        createAccount({ accountInfo, history });
    };

    render() {
        const initialValues = getCreateAccountInitialValues();

        return (
            <Page>
                <div className={this.props.classes.container}>
                    <CreateAccountForm
                        initialValues={initialValues}
                        onSubmit={this.createAccount}
                    />
                </div>
            </Page>
        );
    }
}

export default compose(
    withRouter,
    classify(defaultClasses)
)(CreateAccountPage);

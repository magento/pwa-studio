import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Page from 'src/components/Page';
import CreateAccountForm from 'src/components/CreateAccount';
import classes from './createAccountPage.css';

class CreateAccountPage extends Component {
    createAccount = accountInfo => {
        const { handleCreateAccount, history } = this.props;
        handleCreateAccount({ accountInfo, history })
    };

    render() {
        return (
            <Page>
                <div className={classes.container}>
                    <div className={classes.formWrapper}>
                        <CreateAccountForm
                            initialValues={{ email: 'test@example.com', firstName: 'Darth', lastName: 'Vader' }}
                            onSubmit={this.createAccount}/>
                    </div>
                </div>
            </Page>
        );
    }
}

export default withRouter(CreateAccountPage);

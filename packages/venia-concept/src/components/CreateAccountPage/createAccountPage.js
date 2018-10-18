import React, { Component } from 'react';
import Page from 'src/components/Page';
import CreateAccountForm from 'src/components/CreateAccount';
import classes from './createAccountPage.css';

export default class CreateAccountPage extends Component {
    render() {
        return (
            <Page>
                <div className={classes.container}>
                    <div className={classes.formWrapper}>
                        <CreateAccountForm />
                    </div>
                </div>
            </Page>
        );
    }
}

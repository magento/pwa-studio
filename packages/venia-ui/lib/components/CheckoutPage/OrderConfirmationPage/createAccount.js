import React from 'react';

import classes from './orderConfirmationPage.css';

const CreateAccount = () => {
    return (
        <div className={classes.create_account_container}>
            <h2 className={classes.heading}>
                {'Quick Checkout when you return'}
            </h2>
            <div className={classes.create_account_text}>
                {
                    'Set a password and save your information to checkout in one easy step in the future.'
                }
            </div>
            <div className={classes.create_account_text}>
                {'Username, Password, and Create Account Fields go here'}
            </div>
        </div>
    );
};

export default CreateAccount;

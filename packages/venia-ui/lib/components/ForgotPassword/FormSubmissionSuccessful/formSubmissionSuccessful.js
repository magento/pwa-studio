import React from 'react';
import { func, shape, string } from 'prop-types';

import { mergeClasses } from '../../../classify';
import Button from '../../Button';
import defaultClasses from './formSubmissionSuccessful.css';

const FormSubmissionSuccessful = props => {
    const { email, onContinue } = props;
    const classes = mergeClasses(defaultClasses, props.classes);

    const textMessage = `If there is an account associated with ${email}, you will receive an email with a link to change your password.`;
    const CONTINUE_SHOPPING = 'Continue Shopping';

    return (
        <div className={classes.root}>
            <p className={classes.text}>{textMessage}</p>
            <div className={classes.buttonContainer}>
                <Button onClick={onContinue}>{CONTINUE_SHOPPING}</Button>
            </div>
        </div>
    );
};

export default FormSubmissionSuccessful;

FormSubmissionSuccessful.propTypes = {
    classes: shape({
        buttonContainer: string,
        root: string,
        text: string
    }),
    email: string,
    onContinue: func.isRequired
};

import React from 'react';
import { shape, string } from 'prop-types';

import { mergeClasses } from '../../../classify';
import defaultClasses from './formSubmissionSuccessful.css';

const FormSubmissionSuccessful = props => {
    const { email } = props;
    const classes = mergeClasses(defaultClasses, props.classes);

    const textMessage = `If there is an account associated with ${email} you will receive an email with a link to change your password.`;

    return (
        <div className={classes.root}>
            <h2 className={classes.title}>{'Recover Password'}</h2>
            <p className={classes.text}>{textMessage}</p>
        </div>
    );
};

export default FormSubmissionSuccessful;

FormSubmissionSuccessful.propTypes = {
    classes: shape({
        root: string,
        text: string
    }),
    email: string
};

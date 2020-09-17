import React from 'react';
import { shape, string } from 'prop-types';

import { mergeClasses } from '../../../classify';
import defaultClasses from './formSubmissionSuccessful.css';
import { FormattedMessage, useIntl } from 'react-intl';

const FormSubmissionSuccessful = props => {
    const { email } = props;
    const { formatMessage } = useIntl();
    const classes = mergeClasses(defaultClasses, props.classes);

    const textMessage = formatMessage(
        {
            id:
                'If there is an account associated with {email} you will receive an email with a link to change your password.',
            defaultMessage:
                'If there is an account associated with {email} you will receive an email with a link to change your password.'
        },
        { email: email }
    );

    return (
        <div className={classes.root}>
            <h2 className={classes.title}>
                <FormattedMessage
                    id={'Recover Password'}
                    defaultMessage={'Recover Password'}
                />
            </h2>
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

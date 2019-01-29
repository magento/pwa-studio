import React, { Component } from 'react';
import PropTypes from 'prop-types';

import classify from 'src/classify';
import Button from 'src/components/Button';
import defaultClasses from './formSubmissionSuccessful.css';

class FormSubmissionSuccessful extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            text: PropTypes.string,
            buttonContainer: PropTypes.string
        }),
        email: PropTypes.string,
        onContinue: PropTypes.func.isRequired
    };

    get textMessage() {
        const { email } = this.props;

        return `If there is an account associated with
            ${email} you will receive an
            email with a link to change your password`;
    }

    render() {
        const { textMessage } = this;
        const { classes, onContinue } = this.props;

        return (
            <div>
                <p className={classes.text}>{textMessage}</p>
                <div className={classes.buttonContainer}>
                    <Button onClick={onContinue}>Continue Shopping</Button>
                </div>
            </div>
        );
    }
}

export default classify(defaultClasses)(FormSubmissionSuccessful);

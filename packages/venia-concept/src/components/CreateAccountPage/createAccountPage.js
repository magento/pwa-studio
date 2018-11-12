import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CreateAccountForm from 'src/components/CreateAccount';
import classify from 'src/classify';
import defaultClasses from './createAccountPage.css';

class CreateAccountPage extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            container: PropTypes.string
        })
    };

    render() {
        const { classes } = this.props;

        return (
            <div className={classes.container}>
                <CreateAccountForm />
            </div>
        );
    }
}

export default classify(defaultClasses)(CreateAccountPage);

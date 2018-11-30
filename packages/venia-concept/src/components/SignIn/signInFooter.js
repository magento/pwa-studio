import React, { Component, Fragment } from 'react';
import { withFormState } from 'informed';
import PropTypes from 'prop-types';
import { fields } from './constants';
import Button from 'src/components/Button';

class SignInFooter extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            forgotPassword: PropTypes.string,
            signInDivider: PropTypes.string,
            showCreateAccountButton: PropTypes.string
        }),
        setDefaultUsername: PropTypes.func,
        showCreateAccountForm: PropTypes.func,
        formState: PropTypes.object
    };

    render() {
        const { classes } = this.props;

        return (
            <Fragment>
                <div className={classes.forgotPassword}>
                    <a href="/"> Forgot your username or password? </a>
                </div>
                <div className={classes.signInDivider} />
                <div className={classes.showCreateAccountButton}>
                    <Button type="button" onClick={this.showCreateAccountForm}>
                        {' '}
                        Create an Account{' '}
                    </Button>
                </div>
            </Fragment>
        );
    }

    getFieldValue = fieldName => this.props.formState.values[fieldName];

    showCreateAccountForm = () => {
        const { setDefaultUsername, showCreateAccountForm } = this.props;
        setDefaultUsername(this.getFieldValue(fields.username));
        showCreateAccountForm();
    };
}

export default withFormState(SignInFooter);

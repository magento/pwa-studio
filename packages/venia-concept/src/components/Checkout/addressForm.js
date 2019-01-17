import React, { Component, Fragment } from 'react';
import { Form, Text } from 'informed';
import memoize from 'memoize-one';
import { bool, func, shape, string } from 'prop-types';

import classify from 'src/classify';
import Button from 'src/components/Button';
import Label from './label';
import defaultClasses from './addressForm.css';
import { invalidStateMessage } from './constants';
import { isString } from 'util';

const fields = [
    'city',
    'email',
    'firstname',
    'lastname',
    'postcode',
    'region_code',
    'street',
    'telephone'
];

const filterInitialValues = memoize(values =>
    fields.reduce((acc, key) => {
        acc[key] = values[key];
        return acc;
    }, {})
);

class AddressForm extends Component {
    static propTypes = {
        cancel: func.isRequired,
        classes: shape({
            body: string,
            city: string,
            email: string,
            firstname: string,
            footer: string,
            lastname: string,
            postcode: string,
            region_code: string,
            street0: string,
            telephone: string,
            validation: string
        }),
        incorrectAddressMessage: string,
        isAddressIncorrect: bool,
        submit: func.isRequired,
        submitting: bool
    };

    //TODO: implement appropriate validation for the state field
    validateState = value => {
        return isString(value) && value.length > 1 ? null : invalidStateMessage;
    };

    validationBlock = errors => {
        const { isAddressIncorrect, incorrectAddressMessage } = this.props;
        if (errors.region_code) {
            return errors.region_code;
        } else if (isAddressIncorrect) {
            return incorrectAddressMessage;
        } else {
            return null;
        }
    };

    render() {
        const { children, props } = this;
        const { classes, initialValues } = props;
        const values = filterInitialValues(initialValues);

        return (
            <Form
                className={classes.root}
                initialValues={values}
                onSubmit={this.submit}
            >
                {children}
            </Form>
        );
    }

    children = ({ formState }) => {
        const { classes, submitting } = this.props;

        return (
            <Fragment>
                <div className={classes.body}>
                    <h2 className={classes.heading}>Shipping Address</h2>
                    <div className={classes.firstname}>
                        <Label htmlFor={classes.firstname}>First Name</Label>
                        <Text
                            id={classes.firstname}
                            field="firstname"
                            className={classes.textInput}
                        />
                    </div>
                    <div className={classes.lastname}>
                        <Label htmlFor={classes.lastname}>Last Name</Label>
                        <Text
                            id={classes.lastname}
                            field="lastname"
                            className={classes.textInput}
                        />
                    </div>
                    <div className={classes.street0}>
                        <Label htmlFor={classes.street0}>Street</Label>
                        <Text
                            id={classes.street0}
                            field="street[0]"
                            className={classes.textInput}
                        />
                    </div>
                    <div className={classes.city}>
                        <Label htmlFor={classes.city}>City</Label>
                        <Text
                            id={classes.city}
                            field="city"
                            className={classes.textInput}
                        />
                    </div>
                    <div className={classes.postcode}>
                        <Label htmlFor={classes.postcode}>ZIP</Label>
                        <Text
                            id={classes.postcode}
                            field="postcode"
                            className={classes.textInput}
                        />
                    </div>
                    <div className={classes.region_code}>
                        <Label htmlFor={classes.region_code}>State</Label>
                        <Text
                            id={classes.region_code}
                            field="region_code"
                            className={classes.textInput}
                            validate={this.validateState}
                        />
                    </div>
                    <div className={classes.telephone}>
                        <Label htmlFor={classes.telephone}>Phone</Label>
                        <Text
                            id={classes.telephone}
                            field="telephone"
                            className={classes.textInput}
                        />
                    </div>
                    <div className={classes.email}>
                        <Label htmlFor={classes.email}>Email</Label>
                        <Text
                            id={classes.email}
                            field="email"
                            className={classes.textInput}
                        />
                    </div>
                    <div className={classes.validation}>
                        {this.validationBlock(formState.errors)}
                    </div>
                </div>
                <div className={classes.footer}>
                    <Button type="submit" priority="high" disabled={submitting}>
                        Save
                    </Button>
                    <Button onClick={this.cancel}>Cancel</Button>
                </div>
            </Fragment>
        );
    };

    cancel = () => {
        this.props.cancel();
    };

    submit = values => {
        this.props.submit(values);
    };
}

export default classify(defaultClasses)(AddressForm);

/*
const mockAddress = {
    country_id: 'US',
    firstname: 'Veronica',
    lastname: 'Costello',
    street: ['6146 Honey Bluff Parkway'],
    city: 'Calder',
    postcode: '49628-7978',
    region_id: 33,
    region_code: 'MI',
    region: 'Michigan',
    telephone: '(555) 229-3326',
    email: 'veronica@example.com'
};
*/

import React, { Component } from 'react';
import { Form } from 'informed';
import memoize from 'memoize-one';
import PropTypes from 'prop-types';

import classify from 'src/classify';
import Input, {
    createComplexValidator,
    isRequired
} from 'src/components/Input';
import Button from 'src/components/Button';
import { fields, fieldsLabels } from './constants';
import { validatorStateField } from './helpers';
import defaultClasses from './address.css';

const filterInitialValues = memoize(values =>
    Object.keys(fields).reduce((acc, key) => {
        acc[key] = values[key];
        return acc;
    }, {})
);

class AddressForm extends Component {
    static propTypes = {
        cancel: PropTypes.func,
        classes: PropTypes.shape({
            body: PropTypes.string,
            city: PropTypes.string,
            email: PropTypes.string,
            firstname: PropTypes.string,
            footer: PropTypes.string,
            lastname: PropTypes.string,
            postcode: PropTypes.string,
            region_code: PropTypes.string,
            street0: PropTypes.string,
            telephone: PropTypes.string,
            serverValidation: PropTypes.string,
            textInput: PropTypes.string,
            inputRoot: PropTypes.string,
            inputRootFocused: PropTypes.string
        }),
        submit: PropTypes.func,
        isAddressIncorrect: PropTypes.bool,
        incorrectAddressMessage: PropTypes.string
    };

    getValidator = fieldName => {
        const validators = [isRequired];
        fieldName == fields.region_code && validators.push(validatorStateField);
        return createComplexValidator(validators);
    };

    getInput = ({ fieldName, fieldKey }) => {
        const { classes } = this.props;
        const inputClasses = {
            input: classes.textInput,
            root: classes.inputRoot,
            rootFocused: classes.inputRootFocused
        };
        const validator = this.getValidator(fieldName);

        return (
            <div className={classes[fieldKey]}>
                <Input
                    key={fieldName}
                    field={fieldName}
                    classes={inputClasses}
                    label={fieldsLabels[fieldKey]}
                    validate={validator}
                    validateOnChange
                    required
                />
            </div>
        );
    };

    get serverValidationMessage() {
        const {
            classes,
            isAddressIncorrect,
            incorrectAddressMessage
        } = this.props;
        return isAddressIncorrect ? (
            <div className={classes.serverValidation}>
                {incorrectAddressMessage}
            </div>
        ) : null;
    }

    get inputs() {
        return Object.keys(fields).map(fieldKey => {
            const fieldName = fields[fieldKey];
            return this.getInput({ fieldName, fieldKey });
        });
    }

    render() {
        const { inputs } = this;
        const { classes, initialValues, submitting } = this.props;
        const values = filterInitialValues(initialValues);

        return (
            <Form
                className={classes.root}
                initialValues={values}
                onSubmit={this.submit}
            >
                <div className={classes.body}>
                    <h2 className={classes.heading}>Shipping Address</h2>
                    {inputs}
                    {this.serverValidationMessage}
                </div>
                <div className={classes.footer}>
                    <Button type="submit" disabled={submitting}>
                        Save
                    </Button>
                    <Button onClick={this.cancel}>Cancel</Button>
                </div>
            </Form>
        );
    }

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

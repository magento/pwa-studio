import { Component, createElement } from 'react';
import { bool, func, shape, string } from 'prop-types';

import classify from 'src/classify';
import Button from 'src/components/Button';
import Field, { Control } from 'src/components/Field';
import defaultClasses from './shippingAddress.css';

class ShippingAddress extends Component {
    static propTypes = {
        busy: bool.isRequired,
        classes: shape({
            body: string,
            footer: string,
            form: string,
            root: string
        }),
        updateOrder: func.isRequired
    };

    get form() {
        const { classes } = this.props;

        return (
            <form className={classes.form}>
                <Field className={classes.name} label="Name">
                    <Control name="name" type="text" />
                </Field>
                <Field className={classes.country} label="Country">
                    <Control name="country" type="text" />
                </Field>
                <Field className={classes.thoroughfare} label="Street Address">
                    <Control name="thoroughfare" type="text" />
                </Field>
                <Field className={classes.premise} label="Street Address 2">
                    <Control name="premise" type="text" />
                </Field>
                <Field className={classes.locality} label="City">
                    <Control name="locality" type="text" />
                </Field>
                <Field className={classes.postalCode} label="ZIP">
                    <Control name="postalCode" type="text" />
                </Field>
                <Field className={classes.administrativeArea} label="State">
                    <Control name="administrativeArea" type="text" />
                </Field>
            </form>
        );
    }

    render() {
        const { form, props } = this;
        const { busy, classes, updateOrder } = props;

        return (
            <div className={classes.root}>
                <div className={classes.body}>{form}</div>
                <div className={classes.footer}>
                    <Button disabled={busy} onClick={updateOrder}>
                        <span>Save</span>
                    </Button>
                </div>
            </div>
        );
    }
}

export default classify(defaultClasses)(ShippingAddress);

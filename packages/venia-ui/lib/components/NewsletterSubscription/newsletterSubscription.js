import React from 'react';
import { Form } from 'informed';
import { Redirect } from '@magento/venia-drivers';
import { mergeClasses } from '../../classify';
import defaultClasses from './newsletterSubscription.css';
import { useNewsletterSubscription } from '@magento/peregrine/lib/talons/MyAccount/useNewsletterSubscription';
import GET_CUSTOMER_QUERY from '../../queries/getCustomer.graphql';
import SUBSCRIBE_MUTATION from '../../queries/userSubscription.graphql';
import Button from '../Button';
import Checkbox from '../Checkbox';

const NewsletterSubscription = (props) => {
    const classes = mergeClasses(defaultClasses, props.classes);

    const talonProps = useNewsletterSubscription({
        customerQuery: GET_CUSTOMER_QUERY,
        subscribeMutation: SUBSCRIBE_MUTATION
    });

    const { is_subscribed,
        isSignedIn,
        toggleSubscription,
        handleSubmit,
        errors,
        isDisabled
    } = talonProps;

    // Map over any errors we get and display an appropriate error.
    const errorMessage = errors.length
        ? errors
            .map(({ message }) => message)
            .reduce((acc, msg) => msg + '\n' + acc, '')
        : null;

    if (!isSignedIn) {
        return <Redirect to="/" />;
    }

    return <div className={classes.root}>
        <div className={classes.header}>
            <h2 className={classes.title}>Newsletter Subscription</h2>
            <span className={classes.subtitle}>Subscription option</span>
        </div>
        <Form
            className={classes.form}
            onSubmit={handleSubmit}
        >
            <div className={classes.subscribe}>
                <Checkbox
                    field="is_subscribed"
                    label="General Subscription"
                    fieldState={{
                        value: is_subscribed
                    }}
                    onClick={toggleSubscription}
                />
            </div>
            <div className={classes.error}>{errorMessage}</div>
            <div className={classes.actions}>
                <Button disabled={isDisabled} type="submit" priority="high">
                    {isDisabled ? 'Saving' : 'Save'}
                </Button>
            </div>
        </Form>
    </div>
}

export default NewsletterSubscription;

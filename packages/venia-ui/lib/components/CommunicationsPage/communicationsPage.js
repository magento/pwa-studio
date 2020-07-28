import React from 'react';
import { Form } from 'informed';
import { Redirect } from '@magento/venia-drivers';
import { mergeClasses } from '../../classify';
import defaultClasses from './communicationsPage.css';
import { useNewsletterSubscription } from '@magento/peregrine/lib/talons/MyAccount/useNewsletterSubscription';
import GET_CUSTOMER_QUERY from '../../queries/getCustomer.graphql';
import SUBSCRIBE_MUTATION from '../../queries/userSubscription.graphql';
import Button from '../Button';
import Checkbox from '../Checkbox';

const CommunicationsPage = props => {
    const classes = mergeClasses(defaultClasses, props.classes);

    const talonProps = useNewsletterSubscription({
        customerQuery: GET_CUSTOMER_QUERY,
        subscribeMutation: SUBSCRIBE_MUTATION
    });

    const {
        is_subscribed,
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

    return (
        <div className={classes.root}>
            <div className={classes.header}>
                <h1 className={classes.title}>Communications</h1>
                <p>
                    We'd like to stay in touch. Please check the boxes next to
                    the communications you'd like to receive.
                </p>
            </div>
            <Form className={classes.form} onSubmit={handleSubmit}>
                <div className={classes.subscribe}>
                    <h5 className={classes.subscribe_label}>
                        Venia E-Newsletter
                    </h5>
                    <Checkbox
                        field="is_subscribed_venia"
                        label="Stay on the cutting edge of fashion; subscribe to the monthly Venia Newsletter."
                    />
                </div>
                <div className={classes.subscribe}>
                    <h5 className={classes.subscribe_label}>
                        Weekly Promotions notices
                    </h5>
                    <Checkbox
                        field="is_subscribed"
                        label="Save money with exclusive offers and promotions direct to your inbox."
                        fieldState={{
                            value: is_subscribed
                        }}
                        onClick={toggleSubscription}
                    />
                </div>
                <div className={classes.error}>{errorMessage}</div>
                <div className={classes.actions}>
                    <Button disabled={isDisabled} type="submit" priority="high">
                        {isDisabled ? 'Saving' : 'Save Changes'}
                    </Button>
                </div>
            </Form>
        </div>
    );
};

export default CommunicationsPage;

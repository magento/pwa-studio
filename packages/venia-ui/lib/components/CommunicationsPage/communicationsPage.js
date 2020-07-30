import React from 'react';
import { Form } from 'informed';
import { Redirect } from '@magento/venia-drivers';
import { mergeClasses } from '../../classify';
import defaultClasses from './communicationsPage.css';
import { useCommunicationsPage } from '@magento/peregrine/lib/talons/MyAccount/useCommunicationsPage';
import { Title } from '../../components/Head';
import Button from '../Button';
import Checkbox from '../Checkbox';
import FormError from '../FormError';
import Field from '../Field';
import CommunicationsPageOperations from './communicationsPage.gql.js';

const CommunicationsPage = props => {
    const classes = mergeClasses(defaultClasses, props.classes);

    const talonProps = useCommunicationsPage({
        ...CommunicationsPageOperations
    });

    const {
        formErrors,
        isDisabled,
        isSignedIn,
        handleSubmit,
        initialValues
    } = talonProps;

    if (!isSignedIn) {
        return <Redirect to="/" />;
    }

    return (
        <div className={classes.root}>
            <Title>{`Communications - ${STORE_NAME}`}</Title>
            <div className={classes.header}>
                <h1 className={classes.title}>{'Communications'}</h1>
                <p>{`We'd like to stay in touch. Please check the boxes next to
                    the communications you'd like to receive.`}</p>
            </div>
            <Form
                className={classes.form}
                onSubmit={handleSubmit}
                initialValues={initialValues}
            >
                <Field id="firstname" label="Venia E-Newsletter">
                    <Checkbox
                        field="isSubscribed"
                        label="Stay on the cutting edge of fashion; subscribe to the monthly Venia Newsletter."
                    />
                </Field>
                <FormError errors={formErrors} />
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

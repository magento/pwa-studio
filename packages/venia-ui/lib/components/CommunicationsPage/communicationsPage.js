import React, { useCallback } from 'react';
import { Form } from 'informed';
import { Redirect } from '@magento/venia-drivers';
import { useToasts } from '@magento/peregrine';
import { useCommunicationsPage } from '@magento/peregrine/lib/talons/MyAccount/useCommunicationsPage';

import { mergeClasses } from '../../classify';
import Button from '../Button';
import Checkbox from '../Checkbox';
import Field from '../Field';
import FormError from '../FormError';
import { Title } from '../Head';
import { fullPageLoadingIndicator } from '../LoadingIndicator';
import defaultClasses from './communicationsPage.css';
import CommunicationsPageOperations from './communicationsPage.gql.js';

const CommunicationsPage = props => {
    const classes = mergeClasses(defaultClasses, props.classes);

    const [, { addToast }] = useToasts();

    const afterSubmit = useCallback(() => {
        addToast({
            type: 'info',
            message: 'Your preferences have been updated.',
            timeout: 5000
        });
    }, [addToast]);

    const talonProps = useCommunicationsPage({
        afterSubmit,
        ...CommunicationsPageOperations
    });

    const {
        formErrors,
        handleSubmit,
        initialValues,
        isDisabled,
        isSignedIn
    } = talonProps;

    if (!isSignedIn) {
        return <Redirect to="/" />;
    }

    if (!initialValues) {
        return fullPageLoadingIndicator;
    }

    return (
        <div className={classes.root}>
            <Title>{`Communications - ${STORE_NAME}`}</Title>
            <h1 className={classes.title}>{'Communications'}</h1>
            <p>{`We'd like to stay in touch. Please check the boxes next to
                    the communications you'd like to receive.`}</p>
            <FormError errors={formErrors} />
            <Form
                className={classes.form}
                onSubmit={handleSubmit}
                initialValues={initialValues}
            >
                <Field id="isSubscribed" label="Venia E-Newsletter">
                    <Checkbox
                        field="isSubscribed"
                        label="Stay on the cutting edge of fashion; subscribe to the monthly Venia Newsletter."
                    />
                </Field>
                <div className={classes.buttonsContainer}>
                    <Button disabled={isDisabled} type="submit" priority="high">
                        {isDisabled ? 'Saving' : 'Save Changes'}
                    </Button>
                </div>
            </Form>
        </div>
    );
};

export default CommunicationsPage;

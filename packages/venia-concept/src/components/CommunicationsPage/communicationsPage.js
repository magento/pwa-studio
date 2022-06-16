import React, { useCallback } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Form } from 'informed';
import { useToasts } from '@magento/peregrine';
import { useCommunicationsPage } from '@magento/peregrine/lib/talons/CommunicationsPage/useCommunicationsPage';

import { useStyle } from '@magento/venia-ui/lib/classify';
import Button from '@magento/venia-ui/lib/components/Button';
import Checkbox from '@magento/venia-ui/lib/components/Checkbox';
import Field from '@magento/venia-ui/lib/components/Field';
import FormError from '@magento/venia-ui/lib/components/FormError';
import { StoreTitle } from '@magento/venia-ui/lib/components/Head';
import { fullPageLoadingIndicator } from '@magento/venia-ui/lib/components/LoadingIndicator';
import defaultClasses from '@magento/venia-ui/lib/components/CommunicationsPage/communicationsPage.module.css';

const CommunicationsPage = props => {
    const { formatMessage } = useIntl();
    const classes = useStyle(defaultClasses, props.classes);

    const [, { addToast }] = useToasts();

    const afterSubmit = useCallback(() => {
        addToast({
            type: 'info',
            message: formatMessage({
                id: 'communicationsPage.preferencesText',
                defaultMessage: 'Your preferences have been updated.'
            }),
            timeout: 5000
        });
    }, [addToast, formatMessage]);

    const talonProps = useCommunicationsPage({ afterSubmit });

    const { formErrors, handleSubmit, initialValues, isDisabled } = talonProps;

    if (!initialValues) {
        return fullPageLoadingIndicator;
    }
    const title = formatMessage({
        id: 'communicationsPage.title',
        defaultMessage: 'Communications'
    });

    return (
        <div className={classes.root}>
            <StoreTitle>{title}</StoreTitle>
            <h1 className={classes.title}>
                <FormattedMessage id={'communicationsPage.communicationsText'} defaultMessage={'Communications'} />
            </h1>
            <p>
                <FormattedMessage
                    id={'communicationsPage.optInText'}
                    defaultMessage={
                        "We'd like to stay in touch. Please check the boxes next to the communications you'd like to receive."
                    }
                />
            </p>
            <FormError errors={formErrors} />
            <Form className={classes.form} onSubmit={handleSubmit} initialValues={initialValues}>
                <Field
                    id="isSubscribed"
                    label={formatMessage({
                        id: 'communicationsPage.eNewsletterText',
                        defaultMessage: 'B2BStore E-Newsletter'
                    })}
                >
                    <Checkbox
                        field="isSubscribed"
                        label={formatMessage({
                            id: 'communicationsPage.subscribeText',
                            defaultMessage: 'Stay updated; subscribe to the monthly B2BStore Newsletter.'
                        })}
                    />
                </Field>
                <div className={classes.buttonsContainer}>
                    <Button disabled={isDisabled} type="submit" priority="high">
                        {isDisabled
                            ? formatMessage({
                                  id: 'communicationsPage.savingText',
                                  defaultMessage: 'Saving'
                              })
                            : formatMessage({
                                  id: 'communicationsPage.changesText',
                                  defaultMessage: 'Save Changes'
                              })}
                    </Button>
                </div>
            </Form>
        </div>
    );
};

export default CommunicationsPage;

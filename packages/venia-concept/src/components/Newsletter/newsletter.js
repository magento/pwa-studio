import React, { useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Form } from 'informed';
import { shape, string } from 'prop-types';

import { useNewsletter } from '@magento/peregrine/lib/talons/Newsletter/useNewsletter';
import { useToasts } from '@magento/peregrine';

import { isRequired } from '@magento/venia-ui/lib/util/formValidators';
import { useStyle } from '@magento/venia-ui/lib/classify';
import FormError from '@magento/venia-ui/lib/components/FormError';
import Field from '@magento/venia-ui/lib/components/Field';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';
import TextInput from '@magento/venia-ui/lib/components/TextInput';
import CustomLinkButton from '@orienteed/customComponents/components/CustomLinkButton';
import Shimmer from '@magento/venia-ui/lib/components/Newsletter/newsletter.shimmer';
import defaultClasses from '@magento/venia-ui/lib/components/Newsletter/newsletter.module.css';
import CustomCheckbox from '@orienteed/customComponents/components/CustomCheckbox';

const Newsletter = props => {
    const { formatMessage } = useIntl();
    const classes = useStyle(defaultClasses, props.classes);
    const talonProps = useNewsletter();
    const [, { addToast }] = useToasts();
    const {
        isEnabled,
        errors,
        handleSubmit,
        isBusy,
        isLoading,
        setFormApi,
        newsLetterResponse,
        clearErrors
    } = talonProps;

    useEffect(() => {
        if (newsLetterResponse && newsLetterResponse.status) {
            addToast({
                type: 'success',
                message: formatMessage({
                    id: 'newsletter.subscribeMessage',
                    defaultMessage: 'The email address is subscribed.'
                }),
                timeout: 5000
            });
        }
    }, [addToast, formatMessage, newsLetterResponse]);

    if (isLoading) {
        return <Shimmer />;
    }

    if (!isEnabled) {
        return null;
    }

    const maybeLoadingIndicator = isBusy ? (
        <div className={classes.loadingContainer}>
            <LoadingIndicator>
                <FormattedMessage id={'newsletter.loadingText'} defaultMessage={'Subscribing'} />
            </LoadingIndicator>
        </div>
    ) : null;

    const personalDataTreatment = formatMessage({
        id: 'footer.personalDataTreatment',
        defaultMessage: 'I accept the personal data treatment.'
    });

    return (
        <div className={classes.root} data-cy={'Newsletter-root'}>
            {maybeLoadingIndicator}
            <span data-cy="Newsletter-title" className={classes.title}>
                <FormattedMessage id={'newsletter.titleText'} defaultMessage={'Sign in for news'} />
            </span>

            <p data-cy="Newsletter-infoText" className={classes.newsletter_text}>
                <FormattedMessage
                    id={'newsletter.infoText'}
                    defaultMessage={
                        'Keep up to date with the latest product launches and news. Find out more about our brands and get special promo codes.'
                    }
                />
            </p>
            <FormError allowErrorMessages errors={Array.from(errors.values())} />
            <Form getApi={setFormApi} className={classes.form} onSubmit={handleSubmit}>
                <Field id="email">
                    <TextInput autoComplete="email" field="email" id="email" validate={isRequired} />
                </Field>

                <CustomLinkButton
                    data-cy="Newsletter-submitButton"
                    type="submit"
                    disabled={isBusy}
                    onClick={clearErrors}
                >
                    <FormattedMessage id={'newsletter.subscribeText'} defaultMessage={'Sign up for newsletter'} />
                </CustomLinkButton>
                <div className={classes.checkbox}>
                    <CustomCheckbox field="data_treatment" label={personalDataTreatment} validate={isRequired} />
                </div>
            </Form>
        </div>
    );
};

Newsletter.propTypes = {
    classes: shape({
        modal_active: string,
        root: string,
        title: string,
        form: string,
        buttonsContainer: string
    })
};

export default Newsletter;

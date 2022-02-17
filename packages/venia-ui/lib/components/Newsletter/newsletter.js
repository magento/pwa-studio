import React, { useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Form } from 'informed';
import { shape, string } from 'prop-types';

import { useNewsletter } from '@magento/peregrine/lib/talons/Newsletter/useNewsletter';
import { useToasts } from '@magento/peregrine';

import { isRequired } from '../../util/formValidators';
import { useStyle } from '../../classify';
import FormError from '../FormError';
import Button from '../Button';
import Field from '../Field';
import LoadingIndicator from '../LoadingIndicator';
import TextInput from '../TextInput';
import LinkButton from '../LinkButton';
import Shimmer from './newsletter.shimmer';
import defaultClasses from './newsletter.module.css';

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
                <FormattedMessage
                    id={'newsletter.loadingText'}
                    defaultMessage={'Subscribing'}
                />
            </LoadingIndicator>
        </div>
    ) : null;

    return (
        <div className={classes.root} data-cy={'Newsletter-root'}>
            {maybeLoadingIndicator}
            <span data-cy="Newsletter-title" className={classes.title}>
                <FormattedMessage
                    id={'newsletter.titleText'}
                    defaultMessage={'Subscribe to Venia'}
                />
            </span>

            <p
                data-cy="Newsletter-infoText"
                className={classes.newsletter_text}
            >
                <FormattedMessage
                    id={'newsletter.infoText'}
                    defaultMessage={
                        'Recieve the latest news, update and special offers right to your inbox.'
                    }
                />
            </p>
            <FormError
                allowErrorMessages
                errors={Array.from(errors.values())}
            />
            <Form
                getApi={setFormApi}
                className={classes.form}
                onSubmit={handleSubmit}
            >
                <Field
                    id="email"
                    label={formatMessage({
                        id: 'global.email',
                        defaultMessage: 'Email'
                    })}
                >
                    <TextInput
                        autoComplete="email"
                        field="email"
                        id="email"
                        validate={isRequired}
                    />
                </Field>
                <LinkButton
                    data-cy="Newsletter-submitButton"
                    className={classes.subscribe_link}
                    type="submit"
                    disabled={isBusy}
                    onClick={clearErrors}
                >
                    <FormattedMessage
                        id={'newsletter.subscribeText'}
                        defaultMessage={'Subscribe'}
                    />
                </LinkButton>
                <div className={classes.buttonsContainer}>
                    <Button
                        priority="normal"
                        type="submit"
                        disabled={isBusy}
                        onClick={clearErrors}
                    >
                        <FormattedMessage
                            id={'newsletter.subscribeText'}
                            defaultMessage={'Subscribe'}
                        />
                    </Button>
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

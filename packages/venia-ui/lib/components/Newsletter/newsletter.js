import React, { Fragment, useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Form } from 'informed';
import { shape, string } from 'prop-types';

import { useNewsletter } from '@magento/peregrine/lib/talons/Newsletter/useNewsletter';
import { useToasts } from '@magento/peregrine';

import { isRequired } from '../../util/formValidators';
import { useStyle } from '../../classify';
import FormError from '../FormError';
import Button from '../Button';
import LoadingIndicator from '../LoadingIndicator';
import TextInput from '../TextInput';
import defaultClasses from './newsletter.css';
import LinkButton from '../LinkButton';

const Newsletter = props => {
    const { formatMessage } = useIntl();
    const classes = useStyle(defaultClasses, props.classes);
    const talonProps = useNewsletter();
    const [, { addToast }] = useToasts();
    const {
        errors,
        handleSubmit,
        isBusy,
        setFormApi,
        newsLetterResponse
    } = talonProps;
    useEffect(() => {
        if (newsLetterResponse && newsLetterResponse.status) {
            addToast({
                type: 'info',
                message: formatMessage({
                    id: 'newsletter.subscribeMessage',
                    defaultMessage: 'The email address is subscribed.'
                }),
                timeout: 5000
            });
        }
    }, [addToast, formatMessage, newsLetterResponse]);
    if (isBusy) {
        return (
            <LoadingIndicator global={true}>
                <FormattedMessage
                    id={'newsletter.loadingText'}
                    defaultMessage={'Subscribing'}
                />
            </LoadingIndicator>
        );
    }
    return (
        <Fragment>
            <div className={classes.root}>
                <h2 className={classes.title}>
                    <FormattedMessage
                        id={'newsletter.titleText'}
                        defaultMessage={'Subscribe to Venia'}
                    />
                </h2>

                <p className={classes.newsletter_text}>
                    <FormattedMessage
                        id={'newsletter.infoText'}
                        defaultMessage={
                            'Recieve the latest news, update and special offers right to your inbox.'
                        }
                    />
                </p>
                <FormError errors={Array.from(errors.values())} />
                <Form
                    getApi={setFormApi}
                    className={classes.form}
                    onSubmit={handleSubmit}
                >
                    <TextInput
                        autoComplete="email"
                        field="email"
                        validate={isRequired}
                    />
                    <LinkButton
                        className={classes.subscribe_link}
                        type="submit"
                    >
                        <FormattedMessage
                            id={'newsletter.subscribeText'}
                            defaultMessage={'Subscribe'}
                        />
                    </LinkButton>
                    <div className={classes.buttonsContainer}>
                        <Button priority="normal" type="submit">
                            <FormattedMessage
                                id={'newsletter.subscribeText'}
                                defaultMessage={'Subscribe'}
                            />
                        </Button>
                    </div>
                </Form>
            </div>
        </Fragment>
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

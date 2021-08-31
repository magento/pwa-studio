import React, { Fragment, useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Form } from 'informed';
import { shape, string } from 'prop-types';

import { useNewsletter } from '@magento/peregrine/lib/talons/Newsletter/useNewsletter';
import { useToasts } from '@magento/peregrine';

import { isRequired } from '../../util/formValidators';
import { mergeClasses } from '../../classify';
import FormError from '../FormError';
import Button from '../Button';
import LoadingIndicator from '../LoadingIndicator';
import TextInput from '../TextInput';
import defaultClasses from './newsletter.css';

const Newsletter = props => {
    const { formatMessage } = useIntl();
    const classes = mergeClasses(defaultClasses, props.classes);
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
                        defaultMessage={'Subscribe to your Newsletter'}
                    />
                </h2>
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
                    <div className={classes.buttonsContainer}>
                        <Button priority="high" type="submit">
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

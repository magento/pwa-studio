import React, { useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { FormattedMessage, useIntl } from 'react-intl';
import { shape, string } from 'prop-types';
import { Form } from 'informed';

import { useToasts } from '@magento/peregrine';
import { useContactPage } from '@magento/peregrine/lib/talons/ContactPage';

import { useStyle } from '../../classify';
import { isRequired } from '../../util/formValidators';

import Button from '../Button';
import { StoreTitle } from '../Head';
import FormError from '../FormError';
import Field from '../Field';
import TextInput from '../TextInput';
import TextArea from '../TextArea';
import LoadingIndicator from '../LoadingIndicator';
import Shimmer from './contactPage.shimmer';
import defaultClasses from './contactPage.module.css';

const ContactPage = props => {
    const { classes: propClasses } = props;
    const classes = useStyle(defaultClasses, propClasses);
    const { formatMessage } = useIntl();
    const talonProps = useContactPage();
    const [, { addToast }] = useToasts();

    const {
        isEnabled,
        errors,
        handleSubmit,
        isBusy,
        isLoading,
        setFormApi,
        response
    } = talonProps;

    useEffect(() => {
        if (response && response.status) {
            addToast({
                type: 'success',
                message: formatMessage({
                    id: 'contactPage.submitMessage',
                    defaultMessage: 'Your message has been sent.'
                }),
                timeout: 5000
            });
        }
    }, [addToast, formatMessage, response]);

    if (!isLoading && !isEnabled) {
        return <Redirect to="/" />;
    }

    if (isLoading) {
        return <Shimmer />;
    }

    const maybeLoadingIndicator = isBusy ? (
        <div className={classes.loadingContainer}>
            <LoadingIndicator>
                <FormattedMessage
                    id={'contactPage.loadingText'}
                    defaultMessage={'Sending'}
                />
            </LoadingIndicator>
        </div>
    ) : null;

    return (
        <div className={classes.root} data-cy="ContactPage-root">
            <StoreTitle>
                {formatMessage({
                    id: 'contactPage.title',
                    defaultMessage: 'Contact Us'
                })}
            </StoreTitle>
            <div className={classes.banner}>{/** Banner CMS Block **/}</div>
            <div className={classes.content}>
                <div className={classes.formContainer}>
                    {maybeLoadingIndicator}
                    <h1 className={classes.title}>
                        <FormattedMessage
                            id={'contactPage.titleText'}
                            defaultMessage={'Contact Us'}
                        />
                    </h1>

                    <p className={classes.subtitle}>
                        <FormattedMessage
                            id={'contactPage.infoText'}
                            defaultMessage={`Drop us a line and we'll get back to you as soon as possible.`}
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
                            id="contact-name"
                            label={formatMessage({
                                id: 'global.name',
                                defaultMessage: 'Name'
                            })}
                        >
                            <TextInput
                                autoComplete="name"
                                field="name"
                                id="contact-name"
                                validate={isRequired}
                            />
                        </Field>
                        <Field
                            id="contact-email"
                            label={formatMessage({
                                id: 'global.email',
                                defaultMessage: 'Email'
                            })}
                        >
                            <TextInput
                                autoComplete="email"
                                field="email"
                                id="contact-email"
                                validate={isRequired}
                                placeholder={formatMessage({
                                    id: 'global.emailPlaceholder',
                                    defaultMessage: 'abc@xyz.com'
                                })}
                            />
                        </Field>
                        <Field
                            id="contact-telephone"
                            label={formatMessage({
                                id: 'contactPage.telephone',
                                defaultMessage: 'Phone Number'
                            })}
                            optional={true}
                        >
                            <TextInput
                                autoComplete="tel"
                                field="telephone"
                                id="contact-telephone"
                                placeholder={formatMessage({
                                    id: 'contactPage.telephonePlaceholder',
                                    defaultMessage: '(222)-222-2222'
                                })}
                            />
                        </Field>
                        <Field
                            id="contact-comment"
                            label={formatMessage({
                                id: 'contactPage.comment',
                                defaultMessage: 'Message'
                            })}
                        >
                            <TextArea
                                autoComplete="comment"
                                field="comment"
                                id="contact-comment"
                                validate={isRequired}
                                placeholder={formatMessage({
                                    id: 'contactPage.commentPlaceholder',
                                    defaultMessage: `Tell us what's on your mind`
                                })}
                            />
                        </Field>
                        <div className={classes.buttonsContainer}>
                            <Button
                                priority="high"
                                type="submit"
                                disabled={isBusy}
                            >
                                <FormattedMessage
                                    id={'contactPage.submit'}
                                    defaultMessage={'Send'}
                                />
                            </Button>
                        </div>
                    </Form>
                </div>
                <div className={classes.sideContent}>
                    {/** Side content CMS Block **/}
                </div>
            </div>
        </div>
    );
};

ContactPage.propTypes = {
    classes: shape({
        root: string,
        banner: string,
        content: string,
        formContainer: string,
        sideContent: string
    })
};

export default ContactPage;

import React, { Fragment, useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { shape, string } from 'prop-types';
import { Form } from 'informed';

import { useToasts } from '@magento/peregrine';
import { useContactPage } from '@magento/peregrine/lib/talons/ContactPage';

import { useStyle } from '../../classify';
import { isRequired } from '../../util/formValidators';

import Button from '../Button';
import CmsBlock from '../CmsBlock/block';
import { Meta, StoreTitle } from '../Head';
import FormError from '../FormError';
import Field from '../Field';
import TextInput from '../TextInput';
import TextArea from '../TextArea';
import LoadingIndicator from '../LoadingIndicator';
import ErrorView from '../ErrorView';
import ContactPageShimmer from './contactPage.shimmer';
import defaultClasses from './contactPage.module.css';

const BANNER_IDENTIFIER = 'contact-us-banner';
const SIDEBAR_IDENTIFIER = 'contact-us-sidebar';
const NOT_FOUND_MESSAGE =
    "Looks like the page you were hoping to find doesn't exist. Sorry about that.";

const ContactPage = props => {
    const { classes: propClasses } = props;
    const classes = useStyle(defaultClasses, propClasses);
    const { formatMessage } = useIntl();
    const talonProps = useContactPage({
        cmsBlockIdentifiers: [BANNER_IDENTIFIER, SIDEBAR_IDENTIFIER]
    });
    const [, { addToast }] = useToasts();

    const {
        isEnabled,
        cmsBlocks,
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
        return (
            <Fragment>
                <StoreTitle>
                    {formatMessage({
                        id: 'contactPage.title',
                        defaultMessage: 'Contact Us'
                    })}
                </StoreTitle>
                <ErrorView
                    message={formatMessage({
                        id: 'magentoRoute.routeError',
                        defaultMessage: NOT_FOUND_MESSAGE
                    })}
                />
            </Fragment>
        );
    }

    if (isLoading) {
        return <ContactPageShimmer />;
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

    const contactUsBannerContent = cmsBlocks.find(
        item => item.identifier === BANNER_IDENTIFIER
    )?.content;

    const contactUsBanner = contactUsBannerContent ? (
        <div className={classes.banner}>
            <CmsBlock content={contactUsBannerContent} />
        </div>
    ) : null;

    const contactUsSidebarContent = cmsBlocks.find(
        item => item.identifier === SIDEBAR_IDENTIFIER
    )?.content;

    const contactUsSidebar = contactUsSidebarContent ? (
        <div className={classes.sideContent}>
            <CmsBlock content={contactUsSidebarContent} />
        </div>
    ) : null;

    const pageTitle = formatMessage({
        id: 'contactPage.title',
        defaultMessage: 'Contact Us'
    });

    const metaDescription = formatMessage({
        id: 'contactPage.metaDescription',
        defaultMessage: 'Contact Us'
    });

    return (
        <Fragment>
            <StoreTitle>{pageTitle}</StoreTitle>
            <Meta name="title" content={pageTitle} />
            <Meta name="description" content={metaDescription} />
            <article className={classes.root} data-cy="ContactPage-root">
                {contactUsBanner}
                <div className={classes.content}>
                    <div
                        className={classes.formContainer}
                        data-cy="ContactPage-formContainer"
                    >
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
                                    data-cy="name"
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
                                    data-cy="email"
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
                                    data-cy="telephone"
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
                                    data-cy="comment"
                                />
                            </Field>
                            <div className={classes.buttonsContainer}>
                                <Button
                                    priority="high"
                                    type="submit"
                                    disabled={isBusy}
                                    data-cy="submit"
                                >
                                    <FormattedMessage
                                        id={'contactPage.submit'}
                                        defaultMessage={'Send'}
                                    />
                                </Button>
                            </div>
                        </Form>
                    </div>
                    {contactUsSidebar}
                </div>
            </article>
        </Fragment>
    );
};

ContactPage.propTypes = {
    classes: shape({
        loadingContainer: string,
        banner: string,
        sideContent: string,
        root: string,
        content: string,
        formContainer: string,
        title: string,
        subtitle: string,
        form: string,
        buttonsContainer: string
    })
};

export default ContactPage;

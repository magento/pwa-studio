import React, { Fragment } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Form } from 'informed';
import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from './additional.module.css';
import ScrollAnchor from '@magento/venia-ui/lib/components/ScrollAnchor/scrollAnchor';
import Field from '@magento/venia-ui/lib/components/Field';
import TextInput from '@magento/venia-ui/lib/components/TextInput';
import TextArea from '@magento/venia-ui/lib/components/TextArea';
import Button from '@magento/venia-ui/lib/components/Button';
import { useAdditionalData } from '@orienteed/additionalCheckout/src/talons/useAdditionalData';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';

const Additional = props => {
    const { reviewOrderButtonClicked } = props;
    const classes = useStyle(defaultClasses);
    const { formatMessage } = useIntl();

    const { handleAdditionalData, isLoading, additionalInformation } = useAdditionalData();

    if (isLoading) {
        return (
            <LoadingIndicator>
                <FormattedMessage
                    id={'creditLoading.creditLoadingText'}
                    defaultMessage={'Loading Additional Information'}
                />
            </LoadingIndicator>
        );
    }

    const additionalInfo = !reviewOrderButtonClicked ? (
        <div className={classes.additional_fields_container}>
            <ScrollAnchor>
                <div className={classes.root}>
                    {/* {additionalFields} */}
                    <Fragment>
                        <Form className={classes.additionalForm} onSubmit={handleAdditionalData}>
                            <div className={classes.cardHeader}>
                                <h5 className={classes.cardTitle}>
                                    <FormattedMessage id={'additional.cardTitle'} defaultMessage={'Additional'} />
                                </h5>
                            </div>
                            <div className={classes.cardBody}>
                                <div className={classes.comment}>
                                    <TextArea
                                        id="additionalMessage"
                                        field="additionalMessage"
                                        initialValue={additionalInformation.comment}
                                        placeholder={formatMessage({
                                            id: 'additional.additionalMessage',
                                            defaultMessage: 'Comment'
                                        })}
                                    />
                                </div>
                                <div className={classes.externalOrderNumber}>
                                    <Field
                                        id="externalOrderNumber"
                                        field="externalOrderNumber"
                                        label={formatMessage({
                                            id: 'additional.email',
                                            defaultMessage: 'External order number'
                                        })}
                                    >
                                        <TextInput
                                            field="externalOrderNumber"
                                            id="externalOrderNumber"
                                            initialValue={additionalInformation.external_order_number}
                                        />
                                    </Field>
                                </div>
                            </div>
                        </Form>
                    </Fragment>
                </div>
            </ScrollAnchor>
        </div>
    ) : !additionalInformation.comment && !additionalInformation.external_order_number ? null : (
        <div className={classes.additional_fields_container}>
            <ScrollAnchor>
                <div className={classes.root}>
                    {/* {additionalFields} */}
                    <Fragment>
                        <div className={classes.cardHeader}>
                            <h5 className={classes.cardTitle}>
                                <FormattedMessage id={'additional.cardTitle'} defaultMessage={'Additional'} />
                            </h5>
                        </div>
                        <div className={classes.cardBody}>
                            {additionalInformation.comment && (
                                <div className={classes.comment}>
                                    <FormattedMessage
                                        id={'additional.additionalMessage'}
                                        defaultMessage={'Comment : '}
                                    />
                                    {additionalInformation.comment}
                                </div>
                            )}
                            {additionalInformation.external_order_number && (
                                <div className={classes.externalOrderNumber}>
                                    <FormattedMessage
                                        id={'additional.email'}
                                        defaultMessage={'External order number : '}
                                    />
                                    {additionalInformation.external_order_number}
                                </div>
                            )}
                        </div>
                    </Fragment>
                </div>
            </ScrollAnchor>
        </div>
    );

    return additionalInfo;
};

export default Additional;

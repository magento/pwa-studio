import React, { Suspense, useMemo } from 'react';
import { Form } from 'informed';
import { FormattedMessage, useIntl } from 'react-intl';

import LoadingIndicator from '../../LoadingIndicator';
import TextArea from '../../TextArea';
import TextInput from '../../TextInput';
import { Accordion, Section } from '../../Accordion';

import { useStyle } from '@magento/venia-ui/lib/classify';

import defaultClasses from './orderAttributesForm.module.css';

const OrderAttributesForm = props => {
    const { handleChange, orderAttributesData, checkoutStep, orderAttributesIsActivated } = props;
    const { formatMessage } = useIntl();
    const classes = useStyle(defaultClasses, props.classes);

    const isShowing = useMemo(() => (orderAttributesIsActivated && checkoutStep > 3) || checkoutStep <= 3, [
        orderAttributesIsActivated,
        checkoutStep
    ]);

    return (
        <>
            {isShowing && (
                <div className={classes.root}>
                    {checkoutStep <= 3 ? (
                        <Accordion canOpenMultiple={true}>
                            <Section
                                data-cy="PriceAdjustments-couponCodeSection"
                                id={'coupon_code'}
                                title={formatMessage({
                                    id: 'orderAttributes.label',
                                    defaultMessage: 'Order Attributes'
                                })}
                            >
                                <Suspense fallback={<LoadingIndicator />}>
                                    <div>
                                        <span>
                                            <FormattedMessage id="deliveryDate.commentDate" defaultMessage="Comment" />
                                        </span>
                                        <Form>
                                            <TextArea
                                                onChange={e => handleChange('comment', e.target.value)}
                                                id="comment"
                                                field="comment"
                                                maxLength={10000}
                                            />
                                        </Form>
                                    </div>
                                    <div>
                                        <span>
                                            <FormattedMessage
                                                id="orderDetails.externalOrderNumber"
                                                defaultMessage="External order number"
                                            />
                                        </span>
                                        <Form>
                                            <TextInput
                                                onChange={e => handleChange('external_order_number', e.target.value)}
                                                field="securityCode"
                                            />
                                        </Form>
                                    </div>
                                </Suspense>
                            </Section>
                        </Accordion>
                    ) : (
                        <>
                            <h5 className={classes.heading}>
                                <FormattedMessage id={'orderAttributes.label'} defaultMessage={'Order Attributes'} />
                            </h5>
                            {orderAttributesData.comment && (
                                <div>
                                    <span>
                                        <FormattedMessage id="deliveryDate.commentDate" defaultMessage="Comment: " />
                                    </span>
                                    <span>{orderAttributesData.comment}</span>
                                </div>
                            )}
                            {orderAttributesData.external_order_number && (
                                <div>
                                    <span>
                                        <FormattedMessage
                                            id="orderDetails.externalOrderNumber"
                                            defaultMessage="External order number: "
                                        />
                                    </span>
                                    <span>{orderAttributesData.external_order_number}</span>
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}
        </>
    );
};

export default OrderAttributesForm;

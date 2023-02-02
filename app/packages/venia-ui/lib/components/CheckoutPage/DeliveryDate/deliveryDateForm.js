import React, { useState, useMemo, Suspense } from 'react';
import moment from 'moment';
import { Form } from 'informed';
import { FormattedMessage, useIntl } from 'react-intl';

import DatePicker from 'react-datepicker';
import LoadingIndicator from '../../LoadingIndicator';
import Select from '../../Select';
import TextArea from '../../TextArea';
import TextInput from '../../TextInput';
import { Accordion, Section } from '../../Accordion';
import { isRequired } from '@magento/venia-ui/lib/util/formValidators';

import { useStyle } from '@magento/venia-ui/lib/classify';

import 'react-datepicker/dist/react-datepicker.css';
import defaultClasses from './deliveryDateForm.module.css';

const DeliveryDateForm = props => {
    const { deliveryDateData, deliveryDate, handleChange, checkoutStep, local } = props;
    const classes = useStyle(defaultClasses, props.classes);
    const [date, setDate] = useState();
    const { formatMessage } = useIntl();

    moment.locale(local);

    const isDeliveryDateEmpty = useMemo(() => {
        const isEmpty = Object.keys(deliveryDateData).every(ele => deliveryDateData[ele] === '');
        return isEmpty;
    }, [deliveryDateData]);

    const formatDeliveryDate = moment(new Date(deliveryDateData?.mp_delivery_date)).format('L');

    const isWeekday = date => {
        const { deliveryDaysOff } = deliveryDate?.deliveryTime;
        const day = date.getDay();
        const isWeek = deliveryDaysOff.includes(String(day));
        return !isWeek;
    };

    const disabledDate = data => {
        const dateTime = data.getTime();
        const { deliveryDateOff } = deliveryDate?.deliveryTime;
        const daysOffTime = deliveryDateOff.map(item => new Date(item).getTime());
        const isDisabled = daysOffTime.includes(dateTime);
        return isDisabled ? classes.disabled : undefined;
    };

    const deliveryTime = deliveryDate?.deliveryTime?.deliveryTime?.map(item => {
        const element = {
            value: item,
            label: item
                .split('-')
                ?.map(ele => ele.trim().slice(0, 5))
                .join(' - ')
        };
        return element;
    });

    const handleDateChange = date => {
        setDate(date);
        const dateFormat = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate();
        handleChange('mp_delivery_date', dateFormat);
    };

    const formatDeliveryTime = deliveryDateData?.mp_delivery_time
        ?.split('-')
        ?.map(ele => ele.trim().slice(0, 5))
        .join(' - ');

    const isShowing = useMemo(() => (!isDeliveryDateEmpty && checkoutStep > 3) || checkoutStep <= 3, [
        isDeliveryDateEmpty,
        checkoutStep
    ]);

    return (
        <>
            {isShowing && (
                <div>
                    {checkoutStep <= 3 ? (
                        <Accordion canOpenMultiple={true}>
                            <Section
                                data-cy="PriceAdjustments-couponCodeSection"
                                id={'coupon_code'}
                                title={formatMessage({
                                    id: 'deliveryDate.deliveryDate',
                                    defaultMessage: 'Delivery Date'
                                })}
                            >
                                <Suspense fallback={<LoadingIndicator />}>
                                    <div className={classes.deliveryDateContainer}>
                                        <div className={classes.gridWrapper}>
                                            <div className={classes.dataPickerWrapper}>
                                                <span>
                                                    <FormattedMessage
                                                        id={'deliveryDate.deliveryDate'}
                                                        defaultMessage={'Delivery Date'}
                                                    />
                                                </span>
                                                <DatePicker
                                                    selected={date}
                                                    filterDate={isWeekday}
                                                    onChange={handleDateChange}
                                                    locale={local}
                                                    className={classes.datePicker}
                                                    dateFormat={moment(date).format('L')}
                                                    dayClassName={disabledDate}
                                                    minDate={new Date()}
                                                />
                                            </div>
                                            {deliveryDate?.deliveryTime && (
                                                <div className={classes.timeWrapper}>
                                                    <span>
                                                        <FormattedMessage
                                                            id={'deliveryDate.deliveryTime'}
                                                            defaultMessage={'Delivery Time'}
                                                        />
                                                    </span>
                                                    <Form>
                                                        <Select
                                                            field="shippingMethod"
                                                            initialValue={''}
                                                            items={[
                                                                {
                                                                    label: formatMessage({
                                                                        id: 'deliveryDate.pleaseSelect',
                                                                        defaultMessage: 'Please select one'
                                                                    })
                                                                },
                                                                ...deliveryTime
                                                            ]}
                                                            onChange={e =>
                                                                handleChange('mp_delivery_time', e.target.value)
                                                            }
                                                        />
                                                    </Form>
                                                </div>
                                            )}
                                        </div>
                                        {deliveryDate?.deliveryTime.isEnabledHouseSecurityCode === '1' && (
                                            <div className={classes.securityCode}>
                                                <span>
                                                    <FormattedMessage
                                                        id={'deliveryDate.houseSecurityCode'}
                                                        defaultMessage={'House Security Code: '}
                                                    />
                                                </span>
                                                <TextInput
                                                    onChange={e =>
                                                        handleChange('mp_house_security_code', e.target.value)
                                                    }
                                                    field="securityCode"
                                                />
                                            </div>
                                        )}
                                        {deliveryDate?.deliveryTime.isEnabledDeliveryComment === '1' && (
                                            <div className={classes.deliveryComment}>
                                                <span>
                                                    <FormattedMessage
                                                        id={'deliveryDate.commentDate'}
                                                        defaultMessage={'Comment'}
                                                    />
                                                </span>
                                                <Form>
                                                    <TextArea
                                                        id="description"
                                                        field="description"
                                                        validate={isRequired}
                                                        maxLength={10000}
                                                        onChange={e =>
                                                            handleChange('mp_delivery_comment', e.target.value)
                                                        }
                                                    />
                                                </Form>
                                            </div>
                                        )}
                                    </div>{' '}
                                </Suspense>
                            </Section>
                        </Accordion>
                    ) : (
                        <div className={classes.root}>
                            <h5 className={classes.heading}>
                                <FormattedMessage id={'deliveryDate.deliveryDate'} defaultMessage={'Delivery Date'} />
                            </h5>
                            {deliveryDateData.mp_delivery_date !== '' && (
                                <div>
                                    <span>
                                        <FormattedMessage
                                            id={'deliveryDate.deliveryDate'}
                                            defaultMessage={'Delivery Date: '}
                                        />
                                    </span>
                                    <span>{formatDeliveryDate}</span>
                                </div>
                            )}
                            {deliveryDateData.mp_delivery_time !== '' && (
                                <div>
                                    <span>
                                        <FormattedMessage
                                            id={'deliveryDate.deliveryTime'}
                                            defaultMessage={'Delivery Time: '}
                                        />
                                    </span>
                                    <span>{formatDeliveryTime}</span>
                                </div>
                            )}
                            {deliveryDateData.mp_house_security_code !== '' && (
                                <div>
                                    <span>
                                        <FormattedMessage
                                            id={'deliveryDate.houseSecurityCode'}
                                            defaultMessage={'House Security Code: '}
                                        />
                                    </span>
                                    <span>{deliveryDateData.mp_house_security_code}</span>
                                </div>
                            )}
                            {deliveryDateData.mp_delivery_comment !== '' && (
                                <div>
                                    <span>
                                        <FormattedMessage
                                            id={'deliveryDate.commentDate'}
                                            defaultMessage={'Comment: '}
                                        />
                                    </span>
                                    <span>{deliveryDateData.mp_delivery_comment}</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default DeliveryDateForm;

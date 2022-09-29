import React, { useState } from 'react';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Select from '@magento/venia-concept/src/components/Gallery/SelectField/select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import defaultClasses from './deliveryDatesForm.module.css';
import TextInput from '@magento/venia-ui/lib/components/TextInput';
import TextArea from '@magento/venia-ui/lib/components/TextArea';
import { isRequired } from '@magento/venia-ui/lib/util/formValidators';
import { Form } from 'informed';
import { FormattedMessage, useIntl } from 'react-intl';

const DeliveryDatesForm = props => {
    const { cartId, deliveryDates, handleChange } = props;
    const classes = useStyle(defaultClasses, props.classes);
    const [date, setDate] = useState();
    const { formatMessage } = useIntl();
    const isWeekday = date => {
        const { deliveryDaysOff } = deliveryDates?.deliveryTime;
        const day = date.getDay();
        let isWeek = deliveryDaysOff.includes(String(day));
        return !isWeek;
    };

    const disabledDates = data => {
        const dateTime = data.getTime();
        const { deliveryDateOff } = deliveryDates?.deliveryTime;
        const daysOffTime = deliveryDateOff.map(item => new Date(item).getTime());
        let isDisabled = daysOffTime.includes(dateTime);
        return isDisabled ? classes.disabled : undefined;
    };

    const deliveryTime = deliveryDates?.deliveryTime.deliveryTime.map(item => {
        let element = {
            value: item,
            label: item
                .split('-')
                .map(ele => ele.trim().slice(0, 5))
                .join(' - ')
        };
        return element;
    });

    const handleDateChange = date => {
        setDate(date);
        const dateFormat = date.getDate() + '/' + date.getMonth() + '/' + date.getFullYear();
        handleChange('mp_delivery_date', dateFormat);
    };
    return (
        <div className={classes.root}>
            <h5 className={classes.heading}>Delivery Date</h5>
            <div className={classes.gridWrapper}>
                <div className={classes.dataPickerWrapper}>
                    <span>
                        <FormattedMessage id={'deliveryDate.deliveryDate'} defaultMessage={'Delivery Date'} />
                    </span>
                    <DatePicker
                        selected={date}
                        filterDate={isWeekday}
                        onChange={handleDateChange}
                        dayClassName={disabledDates}
                        minDate={new Date()}
                    />
                </div>
                {deliveryDates?.deliveryTime && (
                    <div className={classes.timeWrapper}>
                        <span>
                            <FormattedMessage id={'deliveryDate.deliveryTime'} defaultMessage={'Delivery Time'} />
                        </span>
                        <Select
                            field="shippingMethod"
                            initialValue={''}
                            items={[
                                {
                                    label: formatMessage({
                                        id: 'additional.pleaseSelect',
                                        defaultMessage: 'Please select one'
                                    })
                                },
                                ...deliveryTime
                            ]}
                            onChange={e => handleChange('mp_delivery_time', JSON.parse(e.target.value).value)}
                        />
                    </div>
                )}
            </div>
            {deliveryDates?.deliveryTime.isEnabledHouseSecurityCode === '1' && (
                <div className={classes.securityCode}>
                    <span>
                        <FormattedMessage
                            id={'deliveryDate.houseSecurityCode'}
                            defaultMessage={'House Security Code'}
                        />
                    </span>
                    <TextInput
                        onChange={e => handleChange('mp_house_security_code', e.target.value)}
                        field="securityCode"
                    />
                </div>
            )}
            {deliveryDates?.deliveryTime.isEnabledDeliveryComment === '1' && (
                <div className={classes.deliveryComment}>
                    <span>
                        <FormattedMessage id={'deliveryDate.commentDate'} defaultMessage={'Comment Date'} />
                    </span>
                    <Form>
                        <TextArea
                            id="description"
                            field="description"
                            validate={isRequired}
                            maxLength={10000}
                            onChange={e => handleChange('mp_delivery_comment', e.target.value)}
                        />
                    </Form>
                </div>
            )}
        </div>
    );
};

export default DeliveryDatesForm;

import React, { useMemo, useState } from 'react';
import defaultClasses from './locationsModal.module.css';
import moment from 'moment';
import { useIntl } from 'react-intl';
import MapContainer from '../Map/MapContainer';
import Dialog from '../../Dialog';
import { useStyle } from '../../../classify';
import { useStoreLocatorContext } from '../StoreLocatorProvider/StoreLocatorProvider';
import DatePicker from 'react-datepicker';
import Field from '../../Field';
import 'react-datepicker/dist/react-datepicker.css';
const LocationsModal = props => {
    const {
        isOpen,
        onCancel,
        onConfirm,
        locationsData,
        selectedLocation,
        handleSelectLocation,
        handleChangeDay,
        holidayDates = []
    } = props;
    // eslint-disable-next-line no-unused-vars
    const { locationsItems, ...rest } = useStoreLocatorContext();
    const classes = useStyle(defaultClasses);
    const { formatMessage } = useIntl();
    const [date, setDate] = useState();
    const addressValue = useMemo(() => {
        if (selectedLocation) {
            const { street, city, country, state_province } = selectedLocation;
            return street + ', ' + state_province + ' ' + city + ' ' + country;
        }
        return '';
    }, [selectedLocation]);

    // Convert the array of date ranges to an array of disabled dates

    const excludeDates = holidayDates?.flatMap(range => {
        const from = new Date(range.from);
        const to = new Date(range.to);
        const dates = [];
        const currentDate = from;
        while (currentDate <= to) {
            dates.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return dates;
    });

    const handleDateChange = date => {
        setDate(date);
        const dateFormat =
            date.getFullYear() +
            '/' +
            (date.getMonth() + 1) +
            '/' +
            date.getDate() +
            ', ' +
            date.getHours() +
            ':' +
            (date.getMinutes() < 10 ? '0' : '') +
            date.getMinutes();
        handleChangeDay(dateFormat);
    };
    const mapProps = { locationsItems: locationsData?.items, ...rest };
    return (
        <Dialog
            onCancel={onCancel}
            isOpen={isOpen}
            onConfirm={onConfirm}
            shouldDisableConfirmButton={!date || !selectedLocation}
            title={formatMessage({
                id: 'storeLocation.SelectStore',
                defaultMessage: 'Select Store'
            })}
        >
            {selectedLocation && (
                <div className={classes.InputWrapper}>
                    <Field
                        label={formatMessage({
                            id: 'storeLocation.address',
                            defaultMessage: 'Address'
                        })}
                    >
                        <span>{addressValue}</span>
                    </Field>
                    <div>
                        <Field
                            label={formatMessage({
                                id: 'storeLocation.selectDay',
                                defaultMessage: 'Select Day'
                            })}
                        >
                            <DatePicker
                                excludeDates={excludeDates}
                                selected={date}
                                showTimeSelect
                                onChange={handleDateChange}
                                // dayClassName={disabledDate}
                                // locale={local}
                                className={classes.datePicker}
                                dateFormat={moment(date).format('L')}
                                minDate={new Date()}
                            />
                        </Field>
                    </div>
                </div>
            )}
            <div className={classes.mapWrapper}>
                <MapContainer
                    selectedLocation={selectedLocation}
                    handleSelectLocation={handleSelectLocation}
                    mapProps={mapProps}
                />
            </div>
        </Dialog>
    );
};

export default LocationsModal;

import { useCallback, useEffect, useState } from 'react';
import { useQuery } from '@apollo/react-hooks';

export const useEditableForm = props => {
    const {
        countriesQuery,
        setEditing,
        submitPaymentMethodAndBillingAddress,
        submitShippingAddress,
        submitShippingMethod
    } = props;

    const [countries, setCountries] = useState(null);

    const { data: countriesData } = useQuery(countriesQuery);

    useEffect(() => {
        if (countriesData) {
            setCountries(countriesData.countries);
        }
    }, [countriesData]);

    const handleCancel = useCallback(() => {
        setEditing(null);
    }, [setEditing]);

    const handleSubmitAddressForm = useCallback(
        async formValues => {
            await submitShippingAddress({
                countries,
                formValues
            });
            setEditing(null);
        },
        [countries, setEditing, submitShippingAddress]
    );

    const handleSubmitPaymentsForm = useCallback(
        async formValues => {
            await submitPaymentMethodAndBillingAddress({
                countries,
                formValues
            });
            setEditing(null);
        },
        [countries, setEditing, submitPaymentMethodAndBillingAddress]
    );

    const handleSubmitShippingForm = useCallback(
        async formValues => {
            await submitShippingMethod({
                formValues
            });
            setEditing(null);
        },
        [setEditing, submitShippingMethod]
    );

    return {
        countries,
        handleCancel,
        handleSubmitAddressForm,
        handleSubmitPaymentsForm,
        handleSubmitShippingForm
    };
};

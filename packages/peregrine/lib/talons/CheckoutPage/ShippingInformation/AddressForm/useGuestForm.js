import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useMutation } from '@apollo/react-hooks';

import { useCartContext } from '../../../../context/cart';

export const useGuestForm = props => {
    const {
        afterSubmit,
        mutations: { setGuestShippingMutation },
        onCancel,
        shippingData
    } = props;

    const errorRef = useRef();

    const [{ cartId }] = useCartContext();

    const [setGuestShipping, { error, loading }] = useMutation(
        setGuestShippingMutation
    );

    const derivedErrorMessage = useMemo(() => {
        let errorMessage;

        if (error) {
            const { graphQLErrors, message } = error;
            errorMessage = graphQLErrors
                ? graphQLErrors.map(({ message }) => message).join(', ')
                : message;
        }

        return errorMessage;
    }, [error]);

    useEffect(() => {
        if (error) {
            errorRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }
    }, [error]);

    const { country, region } = shippingData;
    const { code: countryCode } = country;
    const { code: regionCode } = region;

    const initialValues = {
        ...shippingData,
        country: countryCode,
        region: regionCode
    };

    // Simple heuristic to indicate form was submitted prior to this render
    const isUpdate = !!shippingData.city;

    const handleSubmit = useCallback(
        async formValues => {
            const { country, email, ...address } = formValues;
            try {
                await setGuestShipping({
                    variables: {
                        cartId,
                        email,
                        address: {
                            ...address,
                            country_code: country
                        }
                    }
                });
            } catch {
                return;
            }

            if (afterSubmit) {
                afterSubmit();
            }
        },
        [afterSubmit, cartId, setGuestShipping]
    );

    const handleCancel = useCallback(() => {
        onCancel();
    }, [onCancel]);

    return {
        errorMessage: derivedErrorMessage,
        errorRef,
        handleCancel,
        handleSubmit,
        initialValues,
        isSaving: loading,
        isUpdate
    };
};

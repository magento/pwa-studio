import { useState, useCallback } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_ACCOUNT_NON_CUSTOMER } from '../query/customerAccount.gql.js';
import { useIntl } from 'react-intl';

export const useCreateAccountNonCustomer = props => {
    const { formatMessage } = useIntl();

    const [isDisabledBtn, setIsDisabledBtn] = useState(false);
    const [error, setError] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);
    const formErrors = [];

    // CREATE_ACCOUNT_NON_CUSTOMER Mutation
    const [nonCustomerSendMail] = useMutation(CREATE_ACCOUNT_NON_CUSTOMER);

    const handleSendEmail = useCallback(async formValues => {
        try {
            setIsDisabledBtn(true);
            setErrorMsg(null);
            setError(false);
            setSuccessMsg(null);
            const {
                email,
                name,
                nif,
                address1,
                address2,
                postalCode,
                population,
                province,
                country,
                contactName,
                phone
            } = formValues;
            const variables = {
                email: email,
                name: name,
                nif: nif,
                address1: address1,
                address2: address2,
                postal_code: postalCode,
                population: population,
                province: province,
                country: country,
                contact_name: contactName,
                phone_number: phone
            };

            const {
                data: {
                    nonCustomerSendMail: { error, message }
                }
            } = await nonCustomerSendMail({ variables });
            if (error) {
                setError(true);
                setErrorMsg(message);
            } else {
                setSuccessMsg(message);
            }

            setIsDisabledBtn(false);
        } catch {
            setIsDisabledBtn(false);
        }
    }, []);

    if (error) {
        formErrors.push(
            new Error(
                formatMessage({
                    id: 'checkoutPage.createAccountNonCustomer',
                    defaultMessage: errorMsg
                })
            )
        );
    }

    return {
        successMsg,
        formErrors,
        isDisabledBtn,
        handleSendEmail
    };
};

import { useState, useCallback } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_ACCOUNT_BE_CUSTOMER } from '../query/customerAccount.gql.js';
import { useIntl } from 'react-intl';

export const useCreateAccountBeCustomer = props => {
    const { formatMessage } = useIntl();

    const [isDisabledBtn, setIsDisabledBtn] = useState(false);
    const [error, setError] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);
    const formErrors = [];

    // CREATE_ACCOUNT_BE_CUSTOMER Mutation
    const [beCustomerSendMail] = useMutation(CREATE_ACCOUNT_BE_CUSTOMER);

    const handleSendEmail = useCallback(async formValues => {
        try {
            setIsDisabledBtn(true);
            setErrorMsg(null);
            setError(false);
            setSuccessMsg(null);
            const { email, nif, nClient } = formValues;
            const variables = {
                email: email,
                nif: nif,
                no_of_client: nClient
            };

            const {
                data: {
                    beCustomerSendMail: { error, message }
                }
            } = await beCustomerSendMail({ variables });
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
                    id: 'checkoutPage.createAccountBeCustomer',
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

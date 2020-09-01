import { useCallback, useMemo, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';

import { useAppContext } from '../../context/app';
import { useUserContext } from '../../context/user';

export const useAccountInformationPage = props => {
    const {
        // afterSubmit,
        // mutations: { setNewsletterSubscriptionMutation },
        queries: { getCustomerInformationQuery }
    } = props;

    const [, { toggleDrawer }] = useAppContext();
    const [{ isSignedIn }] = useUserContext();

    const [activeInformation, setActiveInformation] = useState();

    const { data: accountInformationData, error: accountInformationError } = useQuery(
        getCustomerInformationQuery,
        { skip: !isSignedIn, fetchPolicy: 'cache-and-network' }
    );

    const handleEditInformation = useCallback(
        info => {
            setActiveInformation(info);
            toggleDrawer('accountInformation.edit');
        },
        [toggleDrawer]
    );

    const initialValues = useMemo(() => {
        if (accountInformationData) {
            return { customer: accountInformationData.customer };
        }
    }, [accountInformationData]);

    return {
        initialValues,
        formErrors: [accountInformationError],
        isSignedIn,
        handleEditInformation
    }
}

import { useCallback, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useQuery } from '@apollo/client';

import { useAppContext } from '@magento/peregrine/lib/context/app';
import { useUserContext } from '@magento/peregrine/lib/context/user';

// https://devdocs.magento.com/guides/v2.4/graphql/queries/customer-payment-tokens.html
// TODO: Looks like we need a map of the string code type to "VISA", "Discover", etc.
const MOCK_SAVED_PAYMENTS_DATA = {
    customerPaymentTokens: {
        items: [
            {
                details:
                    '{"type":"VI","maskedCC":"1111","expirationDate":"09\\/2022"}',
                public_hash: '377c1514e0...',
                payment_method_code: 'braintree'
            },
            {
                details:
                    '{"type":"DI","maskedCC":"1117","expirationDate":"11\\/2023"}',
                public_hash: 'f5816fe2ab...',
                payment_method_code: 'braintree'
            }
        ]
    }
};

export const normalizeTokens = responseData => {
    const paymentTokens =
        (responseData && responseData.customerPaymentTokens.items) || [];

    return paymentTokens.map(
        ({ details, public_hash, payment_method_code }) => ({
            // details is a stringified object.
            details: JSON.parse(details),
            public_hash,
            payment_method_code
        })
    );
};
/**
 * This talon contains logic for a saved payment page component.
 * It performs effects and returns prop data for rendering the component.
 *
 * @function
 *
 * @param {Object} props
 * @param {SavedPaymentsPageQueries} props.queries GraphQL queries
 *
 * @returns {SavedPaymentsPageTalonProps}
 *
 * @example <caption>Importing into your project</caption>
 * import { useSavedPayments } from '@magento/peregrine/lib/talons/SavedPaymentsPage/useSavedPaymentsPage';
 */
export const useSavedPaymentsPage = props => {
    const {
        queries: { getSavedPaymentsQuery }
    } = props;

    const [
        ,
        {
            actions: { setPageLoading }
        }
    ] = useAppContext();
    const history = useHistory();
    const [{ isSignedIn }] = useUserContext();
    const { data: savedPaymentsData, loading } = useQuery(
        getSavedPaymentsQuery,
        {
            fetchPolicy: 'cache-and-network',
            nextFetchPolicy: 'cache-first',
            skip: !isSignedIn
        }
    );

    // If the user is no longer signed in, redirect to the home page.
    useEffect(() => {
        if (!isSignedIn) {
            history.push('/');
        }
    }, [history, isSignedIn]);

    // Update the page indicator if the GraphQL query is in flight.
    useEffect(() => {
        setPageLoading(loading);
    }, [loading, setPageLoading]);

    const handleAddPayment = useCallback(() => {
        // TODO in PWA-637
    }, []);

    // TODO: Unmock in PWA-636
    // const savedPayments = normalizeTokens(savedPaymentsData);
    const savedPayments = normalizeTokens(MOCK_SAVED_PAYMENTS_DATA);

    return {
        savedPayments,
        handleAddPayment
    };
};

/** JSDoc type definitions */

/**
 * GraphQL formatted string queries used in this talon.
 *
 * @typedef {Object} SavedPaymentsPageQueries
 *
 * @property {GraphQLAST} getSavedPaymentsQuery Query for getting saved payments
 *
 * @see [savedPaymentsPage.gql.js]{@link https://github.com/magento/pwa-studio/blob/develop/packages/venia-ui/lib/components/SavedPaymentsPage/savedPaymentsPage.gql.js}
 * for queries used in Venia
 */

/**
 * Props data to use when rendering a cart page component.
 *
 * @typedef {Object} SavedPaymentsPageTalonProps
 *
 * @property {Array<Object>} savedPayments  An array of saved payment data.
 * @property {function} handleAddPayment Callback function to add a payment.
 */

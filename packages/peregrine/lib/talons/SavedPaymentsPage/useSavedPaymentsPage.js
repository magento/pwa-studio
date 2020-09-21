import { useCallback, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { useQuery } from '@apollo/client';

import { useAppContext } from '@magento/peregrine/lib/context/app';
import { useUserContext } from '@magento/peregrine/lib/context/user';

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

    const savedPayments = normalizeTokens(savedPaymentsData);

    return {
        handleAddPayment,
        isLoading: loading,
        savedPayments
    };
};

/** JSDoc type definitions */

/**
 * GraphQL formatted string queries used in this talon.
 *
 * @typedef {Object} SavedPaymentsPageQueries
 *
 * @property {GraphQLAST} getSavedPaymentsQuery Query for getting saved payments. See https://devdocs.magento.com/guides/v2.4/graphql/queries/customer-payment-tokens.html
 *
 * @see [savedPaymentsPage.gql.js]{@link https://github.com/magento/pwa-studio/blob/develop/packages/venia-ui/lib/components/SavedPaymentsPage/savedPaymentsPage.gql.js}
 * for queries used in Venia
 */

/**
 * Props data to use when rendering a cart page component.
 *
 * @typedef {Object} SavedPaymentsPageTalonProps
 *
 * @property {function} handleAddPayment Callback function to add a payment.
 * @property {boolean} isLoading true if the query is refreshing from network
 * @property {Array<Object>} savedPayments  An array of saved payment data.
 */

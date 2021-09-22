import { useQuery } from '@apollo/client';
import DEFAULT_OPERATIONS from './giftWrappingSection.gql.js';
import mergeOperations from '../../../util/shallowMerge';

/**
 * This talon contains to fetch  the gift wrapping section data.
 * @function
 *
 * @param {Object} props
 * @param {GiftWrappingOperations} props.operations GraphQL mutations for a cart's coupon code.
 *
 * @return {GiftWrappingProps}
 */
export const useGiftWrappingSection = (props = {}) => {
    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);

    const { data, loading } = useQuery(operations.getWrappingConfigQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });

    const storeConfig = data?.storeConfig;
    const { allow_gift_receipt, allow_printed_card } = storeConfig;

    return {
        wrappingConfigData: storeConfig,
        isLoading: loading,
        isVisiable: allow_gift_receipt || allow_printed_card
    };
};

/**
 * Object type returned by the {@link useGiftWrappingSection} talon.
 *
 * @typedef {Object} GiftWrappingProps
 *
 *
 * @property {Object} wrappingConfigData Data returned from the `getWrappingConfigQueryy`.
 * @property {boolean} isLoading True if the data is still loading.
 * @property {boolean} isVisiable True if the gift wrapping section should be displayed.
 */

/**
 * This is a type used by the {@link useGiftWrappingSection} talon.
 *
 * @typedef {Object} GiftWrappingOperations
 *
 * @property {GraphQLAST} getWrappingConfigQuery fetch the store coinfiguration.
 */

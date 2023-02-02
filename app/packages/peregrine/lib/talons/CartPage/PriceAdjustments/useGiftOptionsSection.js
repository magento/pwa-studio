import { useQuery } from '@apollo/client';

import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

import DEFAULT_OPERATIONS from './giftOptionsSection.gql.js';

/**
 * This talon fetches the gift options section data.
 * @function
 *
 * @param {Object} props
 * @param {GiftOptionsSectionOperations} props.operations
 *
 * @return {GiftOptionsSectionProps}
 */
export const useGiftOptionsSection = (props = {}) => {
    const { getGiftOptionsConfigQuery } = mergeOperations(
        DEFAULT_OPERATIONS,
        props.operations
    );

    const { data, loading } = useQuery(getGiftOptionsConfigQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });

    const storeConfig = data?.storeConfig || {};
    const {
        allow_order = '0',
        allow_gift_receipt = '0',
        allow_printed_card = '0'
    } = storeConfig;
    const isVisible =
        allow_order === '1' ||
        allow_gift_receipt === '1' ||
        allow_printed_card === '1';

    return {
        giftOptionsConfigData: storeConfig,
        isLoading: loading,
        isVisible
    };
};

/**
 * Object type returned by the {@link useGiftOptionsSection} talon.
 *
 * @typedef {Object} GiftOptionsSectionProps
 *
 * @property {Object} giftOptionsConfigData Data returned from the `getGiftOptionsConfigQuery`.
 * @property {boolean} isLoading True if the data is still loading.
 * @property {boolean} isVisible True if the gift options section should be displayed.
 */

/**
 * This is a type used by the {@link useGiftOptionsSection} talon.
 *
 * @typedef {Object} GiftOptionsSectionOperations
 *
 * @property {GraphQLAST} getGiftOptionsConfigQuery fetch the store configuration.
 */

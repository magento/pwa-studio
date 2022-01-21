import { useRef, useEffect } from 'react';
import { useQuery } from '@apollo/client';

import { useCartContext } from '@magento/peregrine/lib/context/cart';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

import DEFAULT_OPERATIONS from './cmsDynamicBlock.gql';

export const flatten = cartData => {
    const cartItems = cartData?.cart?.items || [];
    const totalWeight = cartItems.reduce((prevItem, currentItem) => {
        const { product, quantity, configured_variant } = currentItem;

        const currentWeight = configured_variant
            ? configured_variant.weight
            : product.weight || 0;

        return prevItem + currentWeight * quantity;
    }, 0);
    const subtotalExcludingTax =
        cartData?.cart?.prices?.subtotal_excluding_tax?.value || 0;
    const subtotalIncludingTax =
        cartData?.cart?.prices?.subtotal_including_tax?.value || 0;
    const selectedPaymentMethod =
        cartData?.cart?.selected_payment_method?.code || null;
    const shippingCountryCode =
        cartData?.cart?.shipping_addresses[0]?.country?.code || null;
    const shippingPostCode =
        cartData?.cart?.shipping_addresses[0]?.postcode || null;
    const shippingRegionCode =
        cartData?.cart?.shipping_addresses[0]?.region?.code || null;
    const shippingRegionId =
        cartData?.cart?.shipping_addresses[0]?.region?.region_id || null;
    const selectedShippingMethod =
        cartData?.cart?.shipping_addresses[0]?.selected_shipping_method
            ?.method_code || null;
    const totalQuantity = cartData?.cart?.total_quantity || 0;

    return JSON.stringify([
        totalWeight,
        subtotalExcludingTax,
        subtotalIncludingTax,
        selectedPaymentMethod,
        shippingCountryCode,
        shippingPostCode,
        shippingRegionCode,
        shippingRegionId,
        selectedShippingMethod,
        totalQuantity
    ]);
};

/**
 * This talon contains the logic for a cms dynamic block component.
 * It performs effects and returns a data object containing values for rendering the component.
 *
 * This talon performs the following effects:
 *
 * - Get cms dynamic block based on type, locations and given uids
 * - Get sales rules data from cart to refetch dynamic block query when conditions change
 * - Update the {@link CmsDynamicBlockTalonProps} values with the data returned by the query
 *
 * @function
 *
 * @param {Array} props.locations - array of locations of cms dynamic blocks
 * @param {(String|String[])} props.uids - single or multiple uids of cms dynamic blocks
 * @param {String} props.type - type of cms dynamic blocks
 * @param {CmsDynamicBlockOperations} [props.operations]
 *
 * @returns {CmsDynamicBlockTalonProps}
 *
 * @example <caption>Importing into your project</caption>
 * import { useCmsDynamicBlock } from '@magento/peregrine/lib/talons/CmsDynamicBlock/useCmsDynamicBlock';
 */
export const useCmsDynamicBlock = props => {
    const { locations, uids, type } = props;
    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const { getSalesRulesDataQuery, getCmsDynamicBlocksQuery } = operations;

    const [{ cartId }] = useCartContext();

    const { data: cartData } = useQuery(getSalesRulesDataQuery, {
        variables: { cartId },
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        skip: !cartId
    });

    const { loading, error, data, refetch } = useQuery(
        getCmsDynamicBlocksQuery,
        {
            variables: { cartId, type, locations, uids }
        }
    );

    const salesRulesData = flatten(cartData);
    const prevSalesRulesData = useRef(salesRulesData);

    // Refetch data if cart conditions have changed
    useEffect(() => {
        if (prevSalesRulesData.current !== salesRulesData) {
            refetch().then(() => {
                prevSalesRulesData.current = salesRulesData;
            });
        }
    }, [salesRulesData, refetch]);

    return {
        loading,
        error,
        data
    };
};

/** JSDocs type definitions */

/**
 * Props data to use when rendering a gift options component.
 *
 * @typedef {Object} CmsDynamicBlockTalonProps
 *
 * @property {Boolean} loading Query loading indicator.
 * @property {Object} error Error of the GraphQl query.
 * @property {Object} data Data returned by the query.
 */

/**
 * This is a type used by the {@link useCmsDynamicBlock} talon.
 *
 * @typedef {Object} CmsDynamicBlockOperations
 *
 * @property {GraphQLAST} getSalesRulesDataQuery get sales rules data from cart.
 * @property {GraphQLAST} getCmsDynamicBlocksQuery get cms dynamics blocks.
 */

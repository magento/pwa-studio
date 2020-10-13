import React from 'react';
import { bool, func, object, string } from 'prop-types';
import { gql } from '@apollo/client';
import { useEditItem } from '@magento/peregrine/lib/talons/LegacyMiniCart/useEditItem';

import LoadingIndicator from '../LoadingIndicator';
import CartOptions from './cartOptions';

const loadingIndicator = (
    <LoadingIndicator>{`Fetching Item Options...`}</LoadingIndicator>
);

const EditItem = props => {
    const { currencyCode, endEditItem, isUpdatingItem, item } = props;

    const talonProps = useEditItem({
        item,
        query: PRODUCT_DETAILS
    });

    const { configItem, hasError, isLoading, itemHasOptions } = talonProps;

    if (hasError) {
        return <span>Unable to fetch item options.</span>;
    }

    // If we are loading, or if we know we have options but haven't received
    // them from the query, render a loading indicator.
    if (isLoading || (itemHasOptions && !configItem)) {
        return loadingIndicator;
    }

    return (
        <CartOptions
            cartItem={item}
            configItem={configItem || {}}
            currencyCode={currencyCode}
            endEditItem={endEditItem}
            isUpdatingItem={isUpdatingItem}
        />
    );
};

EditItem.propTypes = {
    currencyCode: string,
    endEditItem: func,
    isUpdatingItem: bool,
    item: object.isRequired
};

export default EditItem;

export const PRODUCT_DETAILS = gql`
    query productDetailBySku($sku: String) {
        products(filter: { sku: { eq: $sku } }) {
            items {
                __typename
                id
                name
                sku
                url_key
                ... on ConfigurableProduct {
                    configurable_options {
                        attribute_code
                        attribute_id
                        id
                        label
                        values {
                            default_label
                            label
                            store_label
                            use_default_value
                            value_index
                            swatch_data {
                                ... on ImageSwatchData {
                                    thumbnail
                                }
                                value
                            }
                        }
                    }
                    variants {
                        attributes {
                            code
                            value_index
                        }
                        product {
                            id
                            media_gallery_entries {
                                id
                                disabled
                                file
                                label
                                position
                            }
                            sku
                            stock_status
                        }
                    }
                }
            }
        }
    }
`;

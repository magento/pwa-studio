import React from 'react';
import { array, oneOf, oneOfType, string } from 'prop-types';
import { gql, useQuery } from '@apollo/client';

import ErrorView from '@magento/venia-ui/lib/components/ErrorView';

import DynamicBlock from './dynamicBlock';

export const DYNAMIC_BLOCK_FIXED_TYPE = `SPECIFIED`;
export const DYNAMIC_BLOCK_SALES_RULE_TYPE = `CART_PRICE_RULE_RELATED`;
export const DYNAMIC_BLOCK_CATALOG_RULE_TYPE = `CATALOG_PRICE_RULE_RELATED`;

const getDynamicBlockType = displayMode => {
    if (displayMode === 'fixed') {
        return DYNAMIC_BLOCK_FIXED_TYPE;
    } else if (displayMode === 'salesrule') {
        return DYNAMIC_BLOCK_SALES_RULE_TYPE;
    } else if (displayMode === 'catalogrule') {
        return DYNAMIC_BLOCK_CATALOG_RULE_TYPE;
    }

    return DYNAMIC_BLOCK_FIXED_TYPE;
};

const CmsDynamicBlockGroup = props => {
    const { displayMode, locations, uids } = props;

    const type = getDynamicBlockType(displayMode);

    const { loading, error, data } = useQuery(GET_CMS_DYNAMIC_BLOCKS, {
        variables: { type, locations, uids },
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });

    if (!data) {
        if (loading) {
            return null;
        }

        if (error) {
            return <ErrorView message={error.message} />;
        }
    }

    const { items } = data?.dynamicBlocks || {};

    if (!Array.isArray(items) || !items.length) {
        return null;
    }

    return items.map((item, index) => (
        <DynamicBlock key={item.uid} index={index} {...item} />
    ));
};

CmsDynamicBlockGroup.defaultProps = {
    displayMode: 'fixed'
};

CmsDynamicBlockGroup.propTypes = {
    displayMode: oneOf(['fixed', 'salesrule', 'catalogrule']),
    locations: array,
    uids: oneOfType([string, array]).isRequired
};

export default CmsDynamicBlockGroup;

export const GET_CMS_DYNAMIC_BLOCKS = gql`
    query dynamicBlocks(
        $type: DynamicBlockTypeEnum!
        $locations: [DynamicBlockLocationEnum]
        $uids: [ID]!
    ) {
        dynamicBlocks(
            input: {
                dynamic_block_uids: $uids
                locations: $locations
                type: $type
            }
        ) {
            items {
                content {
                    html
                }
                uid
            }
        }
    }
`;

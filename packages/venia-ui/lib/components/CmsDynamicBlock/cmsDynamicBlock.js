import React from 'react';
import { array, oneOf, oneOfType, string } from 'prop-types';
import { gql, useQuery } from '@apollo/client';

import ErrorView from '@magento/venia-ui/lib/components/ErrorView';

import DynamicBlock from './dynamicBlock';

export const fixedType = `SPECIFIED`;
export const salesRuleType = `CART_PRICE_RULE_RELATED`;
export const catalogPriceRuleType = `CATALOG_PRICE_RULE_RELATED`;

const getType = displayMode => {
    if (displayMode === 'fixed') {
        return fixedType;
    } else if (displayMode === 'salesrule') {
        return salesRuleType;
    } else if (displayMode === 'catalogrule') {
        return catalogPriceRuleType;
    }

    return fixedType;
};

const CmsDynamicBlockGroup = props => {
    const { displayMode, uids } = props;

    const type = getType(displayMode);

    const { loading, error, data } = useQuery(GET_CMS_DYNAMIC_BLOCKS, {
        variables: { type, uids },
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
    uids: oneOfType([string, array])
};

export default CmsDynamicBlockGroup;

export const GET_CMS_DYNAMIC_BLOCKS = gql`
    query dynamicBlocks($type: DynamicBlockTypeEnum!, $uids: [ID]!) {
        dynamicBlocks(input: { dynamic_block_uids: $uids, type: $type }) {
            items {
                content {
                    html
                }
                uid
            }
        }
    }
`;

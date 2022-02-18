import React from 'react';
import { array, oneOf, oneOfType, string } from 'prop-types';

import { useCmsDynamicBlock } from '@magento/peregrine/lib/talons/CmsDynamicBlock/useCmsDynamicBlock';
import ErrorView from '@magento/venia-ui/lib/components/ErrorView';

import {
    DISPLAY_MODE_FIXED_TYPE,
    DYNAMIC_BLOCK_FIXED_TYPE,
    DISPLAY_MODE_SALES_RULE_TYPE,
    DYNAMIC_BLOCK_SALES_RULE_TYPE,
    DISPLAY_MODE_CATALOG_RULE_TYPE,
    DYNAMIC_BLOCK_CATALOG_RULE_TYPE
} from './constants';
import DynamicBlock from './dynamicBlock';

const getDynamicBlockType = displayMode => {
    if (displayMode === DISPLAY_MODE_FIXED_TYPE) {
        return DYNAMIC_BLOCK_FIXED_TYPE;
    } else if (displayMode === DISPLAY_MODE_SALES_RULE_TYPE) {
        return DYNAMIC_BLOCK_SALES_RULE_TYPE;
    } else if (displayMode === DISPLAY_MODE_CATALOG_RULE_TYPE) {
        return DYNAMIC_BLOCK_CATALOG_RULE_TYPE;
    }

    return DYNAMIC_BLOCK_FIXED_TYPE;
};

const CmsDynamicBlockGroup = props => {
    const { displayMode } = props;
    const type = getDynamicBlockType(displayMode);

    const { loading, error, data } = useCmsDynamicBlock({
        ...props,
        type
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
    displayMode: oneOf([
        DISPLAY_MODE_FIXED_TYPE,
        DISPLAY_MODE_SALES_RULE_TYPE,
        DISPLAY_MODE_CATALOG_RULE_TYPE
    ]),
    locations: array,
    uids: oneOfType([string, array]).isRequired
};

export default CmsDynamicBlockGroup;

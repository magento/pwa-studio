import React from 'react';
import { bool, func, object, string } from 'prop-types';
import { useEditItem } from '@magento/peregrine/lib/talons/LegacyMiniCart/useEditItem';

import LoadingIndicator from '../LoadingIndicator';
import CartOptions from './cartOptions';

const ERROR_TEXT = 'Unable to fetch item options.';
const LOADING_TEXT = 'Fetching Item Options...';

const loadingIndicator = <LoadingIndicator>{LOADING_TEXT}</LoadingIndicator>;

const EditItem = props => {
    const { currencyCode, endEditItem, isUpdatingItem, item } = props;

    const talonProps = useEditItem({
        item
    });

    const { configItem, hasError, isLoading, itemHasOptions } = talonProps;

    if (hasError) {
        return <span>{ERROR_TEXT}</span>;
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

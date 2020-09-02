import React, { Fragment } from 'react';
import { shape, string } from 'prop-types';
import { useIntl } from 'react-intl';

import { useStoreSwitcher } from '@magento/peregrine/lib/talons/Header/useStoreSwitcher';

import { mergeClasses } from '../../classify';
import defaultClasses from './storeSwitcher.css';
import GET_AVAILABLE_STORES_CONFIG_DATA from '../../queries/getAvailableStoresConfigData.graphql';
import LinkButton from "../LinkButton";

const StoreSwitcher = props => {
    const talonProps = useStoreSwitcher({
        query: GET_AVAILABLE_STORES_CONFIG_DATA
    });

    const { handleSwitchStore, availableStores } = talonProps;

    const classes = mergeClasses(defaultClasses, props.classes);
    const { formatMessage } = useIntl();
    const triggerClassName = classes.storeSwitcherContainer;

    const stores = Object.keys(availableStores).map((storeCode) => {
        return (
            <LinkButton
                key={storeCode}
                onClick={() => {handleSwitchStore(storeCode); console.log(STORE_VIEW_CODE)}}
            >
                <span>{availableStores[storeCode].storeName}</span>
            </LinkButton>
        );
    });

    return (
        <Fragment>
            <div className={triggerClassName}>
                {stores}
            </div>
        </Fragment>
    );
};

export default StoreSwitcher;

StoreSwitcher.propTypes = {
    classes: shape({
        root: string,
        storeSwitcherContainer: string
    })
};

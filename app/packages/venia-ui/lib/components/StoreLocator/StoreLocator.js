import React from 'react';
import { FormattedMessage } from 'react-intl';
import { arrayOf, node, shape, string } from 'prop-types';
// import { useStockStatusMessage } from '@magento/peregrine/lib/talons/StockStatusMessage/useStockStatusMessage';

import { useStyle } from '../../classify';
// import defaultClasses from './stockStatusMessage.module.css';
import { useStoreLocatorContext } from './StoreLocatorProvider/StoreLocatorProvider';
import Map from './Map/Map';

const location = {
    address: '1600 Amphitheatre Parkway, Mountain View, california.',
    lat: 37.42216,
    lng: -122.08427
};

const StoreLocator = props => {
    const { hello } = useStoreLocatorContext();

    return (
        <div>
            <div>hello</div>
            <Map location={location} zoomLevel={15} />
        </div>
    );
};

export default StoreLocator;

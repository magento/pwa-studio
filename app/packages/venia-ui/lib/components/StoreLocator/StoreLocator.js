import React from 'react';
import { FormattedMessage } from 'react-intl';
import { useStyle } from '../../classify';
import MapContainer from './Map/MapContainer';
import defaultClasses from './Map/MapContainer.module.css';
import { useStoreLocatorContext } from './StoreLocatorProvider/StoreLocatorProvider';

const StoreLocator = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const mapProps = useStoreLocatorContext();

    return <MapContainer mapProps={mapProps} />;
};

export default StoreLocator;

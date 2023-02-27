import React from 'react';
import { FormattedMessage } from 'react-intl';
import { useStyle } from '../../classify';
import MapContainer from './Map/MapContainer';
import defaultClasses from './Map/MapContainer.module.css';

const StoreLocator = props => {
    const classes = useStyle(defaultClasses, props.classes);

    return <MapContainer />;
};

export default StoreLocator;

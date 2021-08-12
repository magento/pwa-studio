import React from 'react';
import { Info } from 'react-feather';
import { FormattedMessage } from 'react-intl';

import { useAddToCartButton } from '@magento/peregrine/lib/talons/Gallery/useAddToCartButton';


const InfoIcon = <Icon size={20} src={Info} />;


const UnsupportedProductTypeMessage = props => {
    const talonProps = useUnsupportedProductTypeMessage(props);
    const {
        isUnsupportedProductType
        
    } = talonProps;
    const classes = useStyle(defaultClasses, props.classes);

    return (
        < Icon className={classes}/>
        
    );
};

export default UnsupportedProductTypeMessage;

UnsupportedProductTypeMessage.defaultProps = {
    icon: InfoIcon
};

UnsupportedProductTypeMessage.propTypes = {

    
};

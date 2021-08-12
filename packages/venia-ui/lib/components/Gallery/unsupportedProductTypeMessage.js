import React from 'react';
import { Info } from 'react-feather';
import { FormattedMessage } from 'react-intl';

import { useAddToCartButton } from '@magento/peregrine/lib/talons/Gallery/useUnsupportedProductTypeMessage';

const InfoIcon = <Icon size={20} src={Info} />;

const UnsupportedProductTypeMessage = props => {
    const talonProps = useUnsupportedProductTypeMessage(props);
    const { isUnsupportedProductType} = talonProps;
    const classes = useStyle(defaultClasses, props.classes);

    return <div>
        <Icon className={classes} />
        <span> Currently unavailable for purchase.</span>
    </div>
};

export default UnsupportedProductTypeMessage;

UnsupportedProductTypeMessage.defaultProps = {
    icon: InfoIcon
};

UnsupportedProductTypeMessage.propTypes = {};

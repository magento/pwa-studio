import React from 'react';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import { shape, string } from 'prop-types';
import { useCheckmoConfig } from '@magento/venia-sample-payments-checkmo/talons/useCheckmoConfig';
import defaultClasses from './checkmo.css';

const CheckMo = props => {
    const classes = mergeClasses(defaultClasses, props.classes);
    const payableToTitle = 'Make Check payable to:';
    const mailingAddressTitle = 'Send Check to:';
    const payableToDefault = 'Venia Inc';
    const mailingAddresDefault =
        'Venia Inc\r\nc/o Payment\r\nPO 122334\r\nAustin Texas"';
    const adressTemplate = str => (
        <span key={str}>
            {str} <br />
        </span>
    );

    const { payableTo, mailingAddress } = useCheckmoConfig();
    const formatAddress = mailingAddress
        ? mailingAddress.split('\n').map(str => adressTemplate(str))
        : mailingAddresDefault.split('\n').map(str => adressTemplate(str));

    return (
        <div className={classes.root}>
            <p className={classes.title}>{payableToTitle}</p>
            <p className={classes.formatAddress}>
                {payableTo ? payableTo : payableToDefault}
            </p>
            <p className={classes.mailingAddressTitle}>{mailingAddressTitle}</p>
            <p className={classes.formatAddress}>{formatAddress}</p>
        </div>
    );
};

CheckMo.propTypes = {
    classes: shape({ root: string })
};
CheckMo.defaultProps = {};
export default CheckMo;

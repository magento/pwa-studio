import React from 'react';

import defaultClasses from './paymentInformation.css';

const PaymentInformation = props => {
    const { showContent, doneEditing } = props;

    /**
     * TODO
     *
     * Change this to reflect diff UI in diff mode.
     */
    const paymentInformation = doneEditing ? (
        <div>In Read Only Mode</div>
    ) : (
        <div>In Edit Mode</div>
    );

    return showContent ? (
        <div className={defaultClasses.container}>
            <div>
                Payment Information Will be handled in PWA-183 and PWA-185
            </div>
            <div className={defaultClasses.text_content}>
                {paymentInformation}
            </div>
        </div>
    ) : (
        <h2 className={defaultClasses.heading}>Payment Information</h2>
    );
};

export default PaymentInformation;

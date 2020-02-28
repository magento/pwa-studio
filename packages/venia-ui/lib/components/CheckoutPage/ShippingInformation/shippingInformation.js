import React from 'react';

import Button from '../../Button';

import defaultClasses from './shippingInformation.css';

const ShippingInformation = props => {
    const { onSave, doneEditing } = props;
    const className = doneEditing
        ? defaultClasses.container
        : defaultClasses.container_edit_mode;

    /**
     * TODO
     *
     * Change this to reflect diff UI in diff mode.
     */
    const shippingInformation = doneEditing ? (
        <div>In Read Only Mode</div>
    ) : (
        <div>In Edit Mode</div>
    );
    return (
        <div className={className}>
            <div>
                Shipping Information Will be handled in PWA-244 and PWA-245
            </div>
            <div className={defaultClasses.text_content}>
                {shippingInformation}
            </div>
            {!doneEditing && (
                <div className={defaultClasses.proceed_button_container}>
                    <Button onClick={onSave} priority="normal">
                        {'Continue to Shipping Method'}
                    </Button>
                </div>
            )}
        </div>
    );
};

export default ShippingInformation;

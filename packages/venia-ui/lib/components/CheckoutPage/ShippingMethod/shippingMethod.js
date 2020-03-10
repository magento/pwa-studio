import React from 'react';

import Button from '../../Button';

import defaultClasses from './shippingMethod.css';

const ShippingMethod = props => {
    const { showContent, onSave, doneEditing } = props;
    const className = doneEditing
        ? defaultClasses.container
        : defaultClasses.container_edit_mode;

    /**
     * TODO
     *
     * Change this to reflect diff UI in diff mode.
     */
    const shippingMethod = doneEditing ? (
        <div>In Read Only Mode</div>
    ) : (
        <div>In Edit Mode</div>
    );
    return showContent ? (
        <div className={className}>
            <div>Shipping Method Will be handled in PWA-179</div>
            <div className={defaultClasses.text_content}>{shippingMethod}</div>
            {!doneEditing ? (
                <div className={defaultClasses.proceed_button_container}>
                    <Button onClick={onSave} priority="normal">
                        {'Continue to Payment Information'}
                    </Button>
                </div>
            ) : null}
        </div>
    ) : (
        <h2 className={defaultClasses.heading}>Shipping Method</h2>
    );
};

export default ShippingMethod;

import React, { useCallback, useState } from 'react';

import Button from '../../Button';

import defaultClasses from './shippingMethod.css';

const ShippingMethod = props => {
    const { onSave } = props;

    const [doneEditing, setDoneEditing] = useState(false);
    const handleClick = useCallback(() => {
        setDoneEditing(true);
        onSave();
    }, [onSave]);

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
    return (
        <div className={className}>
            <div>Shipping Method Will be handled in PWA-179</div>
            <div className={defaultClasses.text_content}>{shippingMethod}</div>
            {!doneEditing ? (
                <div className={defaultClasses.proceed_button_container}>
                    <Button onClick={handleClick} priority="normal">
                        {'Continue to Payment Information'}
                    </Button>
                </div>
            ) : null}
        </div>
    );
};

export default ShippingMethod;

import React from 'react';

import Button from '../../Button';

import defaultClasses from './shippingMethod.css';

export default props => {
    const { showContent, onSave, doneEditing } = props;
    const className = doneEditing
        ? defaultClasses.container
        : defaultClasses.container_edit_mode;

    return showContent ? (
        <div className={className}>
            <div>Shipping Method Will be handled in PWA-179</div>
            <div className={defaultClasses.text_content}>
                {doneEditing ? 'In Read Only Mode' : 'In Edit Mode'}
            </div>
            {!doneEditing && (
                <div className={defaultClasses.proceed_button_container}>
                    <Button onClick={onSave} priority="normal">
                        {'Continue to Payment Information'}
                    </Button>
                </div>
            )}
        </div>
    ) : (
        <h2 className={defaultClasses.heading}>Shipping Method</h2>
    );
};

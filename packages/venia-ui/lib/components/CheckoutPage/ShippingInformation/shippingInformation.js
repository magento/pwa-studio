import React from 'react';

import Button from '../../Button';

import defaultClasses from './shippingInformation.css';

export default props => {
    const { onSave, doneEditing } = props;
    const className = doneEditing
        ? defaultClasses.container
        : defaultClasses.container_edit_mode;

    return (
        <div className={className}>
            <div>
                Shipping Information Will be handled in PWA-244 and PWA-245
            </div>
            <div className={defaultClasses.text_content}>
                {doneEditing ? 'In Read Only Mode' : 'In Edit Mode'}
            </div>
            {!doneEditing && (
                <div className={defaultClasses.proceed_button_container}>
                    <Button onClick={onSave} priority="normal">
                        {'Proceed to Shipping Method'}
                    </Button>
                </div>
            )}
        </div>
    );
};

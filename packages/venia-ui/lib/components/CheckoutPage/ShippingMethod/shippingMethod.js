import React, { useCallback } from 'react';

import Button from '../../Button';

import { renderIf } from '../utilities';

import defaultClasses from './shippingMethod.css';

export default props => {
    const { onSave, doneEditing } = props;
    const renderIfEditing = useCallback(renderIf(!doneEditing), [doneEditing]);

    return (
        <div>
            <div>Shipping Method Will be handled in PWA-179</div>
            {renderIfEditing(
                <div className={defaultClasses.text_content}>In Edit Mode</div>,
                <div className={defaultClasses.text_content}>
                    In Read Only Mode
                </div>
            )}
            {renderIfEditing(() => (
                <div className={defaultClasses.proceed_button_container}>
                    <Button onClick={onSave} priority="high">
                        {'Proceed to Payment Information'}
                    </Button>
                </div>
            ))}
        </div>
    );
};

import React, { useCallback } from 'react';

import Button from '../../Button';

import { renderIf } from '../utilities';

import defaultClasses from './shippingMethod.css';

export default ({ onSave, doneEditing }) => {
    const renderIfEditing = useCallback(renderIf(!doneEditing), [doneEditing]);

    return (
        <div>
            <div>Shipping Method Will be handled in PWA-179</div>
            {renderIfEditing(
                <div className={defaultClasses.textContent}>In Edit Mode</div>,
                <div className={defaultClasses.textContent}>
                    In Read Only Mode
                </div>
            )}
            {renderIfEditing(() => (
                <div className={defaultClasses.proceedButton}>
                    <Button onClick={onSave} priority="high">
                        {'Proceed to Payment Information'}
                    </Button>
                </div>
            ))}
        </div>
    );
};

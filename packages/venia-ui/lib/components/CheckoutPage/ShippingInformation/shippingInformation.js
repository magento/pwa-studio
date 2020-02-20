import React, { useCallback } from 'react';

import Button from '../../Button';

import { renderIf } from '../utilities';

import defaultClasses from './shippingInformation.css';

export default ({ onSave, doneEditing }) => {
    const renderIfEditing = useCallback(renderIf(!doneEditing), [doneEditing]);

    return (
        <div>
            <div>
                Shipping Information Will be handled in PWA-244 and PWA-245
            </div>
            {renderIfEditing(
                <div className={defaultClasses.textContent}>In Edit Mode</div>,
                <div className={defaultClasses.textContent}>
                    In Read Only Mode
                </div>
            )}
            {renderIfEditing(() => (
                <div className={defaultClasses.proceedButton}>
                    <Button onClick={onSave} priority="high">
                        {'Proceed to Shipping Method'}
                    </Button>
                </div>
            ))}
        </div>
    );
};

import React from 'react';
import Button from '../../Button';

export default ({ onSave, doneEditing }) => (
    <div>
        <div>Shipping Information Will be handled in PWA-244 and PWA-245</div>
        {!doneEditing && (
            <Button onClick={onSave} priority="high">
                {'Proceed to Shipping Method'}
            </Button>
        )}
    </div>
);

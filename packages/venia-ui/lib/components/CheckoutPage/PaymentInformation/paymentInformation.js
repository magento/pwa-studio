import React, { useCallback } from 'react';

import { renderIf } from '../utilities';

import defaultClasses from './paymentInformation.css';

export default props => {
    const { doneEditing } = props;
    const renderIfEditing = useCallback(renderIf(!doneEditing), [doneEditing]);

    return (
        <div>
            <div>
                Payment Information Will be handled in PWA-183 and PWA-185
            </div>
            {renderIfEditing(
                <div className={defaultClasses.text_content}>In Edit Mode</div>,
                <div className={defaultClasses.text_content}>
                    In Read Only Mode
                </div>
            )}
        </div>
    );
};

import React from 'react';

import defaultClasses from './paymentInformation.css';

export default props => {
    const { doneEditing } = props;

    return (
        <div className={defaultClasses.container}>
            <div>
                Payment Information Will be handled in PWA-183 and PWA-185
            </div>
            <div className={defaultClasses.text_content}>
                {doneEditing ? 'In Read Only Mode' : 'In Edit Mode'}
            </div>
        </div>
    );
};

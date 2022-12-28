import React from 'react';
import { FormattedMessage } from 'react-intl';

import LoadingIndicator from './indicator';

const staticIndicator = (
    <LoadingIndicator global={true}>
        <FormattedMessage
            id={'loadingIndicator.message'}
            defaultMessage={'Fetching Data...'}
        />
    </LoadingIndicator>
);

export default staticIndicator;

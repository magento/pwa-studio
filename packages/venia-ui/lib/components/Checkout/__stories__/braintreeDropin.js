import React from 'react';
import { storiesOf } from '@storybook/react';

import BraintreeDropin from '../braintreeDropin';

const stories = storiesOf('Components/BraintreeDropin', module);

stories.add('Default', () => {
    const styles = {
        width: '360px'
    };

    const props = {
        onError: () => {},
        onReady: () => {},
        onSuccess: () => {}
    };

    return (
        <div style={styles}>
            <BraintreeDropin {...props} />
        </div>
    );
});

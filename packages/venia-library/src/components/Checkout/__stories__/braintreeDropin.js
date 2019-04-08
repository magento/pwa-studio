import React from 'react';
import { storiesOf } from '@storybook/react';

import BraintreeDropin from '../braintreeDropin';
import 'src/index.css';

const stories = storiesOf('Checkout/BraintreeDropin', module);

stories.add('As Appears in Checkout', () => {
    const styles = {
        width: '360px'
    };

    return (
        <div style={styles}>
            <BraintreeDropin onError={() => {}} onSuccess={() => {}} />
        </div>
    );
});

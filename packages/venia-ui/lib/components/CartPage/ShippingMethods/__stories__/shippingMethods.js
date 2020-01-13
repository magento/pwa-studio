import React from 'react';
import { storiesOf } from '@storybook/react';

import ShippingMethods from '../shippingMethods';

const stories = storiesOf('Components/ShippingMethods', module);

stories.add('Default', () => {
    return <ShippingMethods />;
});

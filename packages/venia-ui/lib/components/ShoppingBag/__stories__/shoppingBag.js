import React, { useRef } from 'react';
import { storiesOf } from '@storybook/react';

import ShoppingBag from '../shoppingBag';

const stories = storiesOf('Venia/ShoppingBag', module);

/*
 *  Story definitions.
 */

stories.add('Default', () => {
    const ref = useRef(null);
    const props = { isOpen: true };

    return <ShoppingBag ref={ref} {...props} />;
});

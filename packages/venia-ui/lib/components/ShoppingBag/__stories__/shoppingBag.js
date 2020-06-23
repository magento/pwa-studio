import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';

import ShoppingBag from '../shoppingBag';

const stories = storiesOf('Venia/ShoppingBag', module);

/*
 *  Story definitions.
 */

stories.add('Default', () => {
    const [isOpen, setIsOpen] = useState(true);
    const props = {
        isOpen,
        setIsOpen
    };

    return <ShoppingBag {...props} />;
});

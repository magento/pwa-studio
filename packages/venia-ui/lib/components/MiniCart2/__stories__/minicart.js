import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';

import MiniCart from '../minicart';

const stories = storiesOf('Venia/MiniCart2', module);

/*
 *  Story definitions.
 */

stories.add('Default', () => {
    const [isOpen, setIsOpen] = useState(true);
    const props = {
        isOpen,
        setIsOpen
    };

    return <MiniCart {...props} />;
});

import React, { useRef } from 'react';
import { storiesOf } from '@storybook/react';

import MiniCart from '../miniCart';

const stories = storiesOf('Venia/MiniCart', module);

/*
 *  Story definitions.
 */

stories.add('Default', () => {
    const ref = useRef(null);
    const props = { isOpen: true };

    return <MiniCart ref={ref} {...props} />;
});

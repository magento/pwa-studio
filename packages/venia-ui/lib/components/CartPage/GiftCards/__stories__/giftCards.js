import React from 'react';
import { storiesOf } from '@storybook/react';

import GiftCards from '../giftCards';

const stories = storiesOf('Components/GiftCards', module);

stories.add('Default', () => {
    return (
        <GiftCards />
    );
});

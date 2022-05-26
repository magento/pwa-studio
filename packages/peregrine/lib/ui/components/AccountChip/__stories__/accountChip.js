import React from 'react';
import { storiesOf } from '@storybook/react';

import AccountChip from '../accountChip';

const stories = storiesOf('Venia/AccountChip', module);

stories.add('Default', () => <AccountChip />);
stories.add('Alternate Fallback Text', () => (
    <AccountChip fallbackText={'User'} />
));

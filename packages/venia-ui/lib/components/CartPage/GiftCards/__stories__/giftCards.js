import React, { useCallback } from 'react';
import { storiesOf } from '@storybook/react';
import { Form, Text, useFormState } from 'informed';

import Button from '../../../Button';
import GiftCards from '../giftCards';

const stories = storiesOf('Components/GiftCards', module);

stories.add('Default', () => {
    return (
        <GiftCards />
    );
});

stories.add('Deebugging', () => {
    const handleSubmit = useCallback(evt => {
        console.log('submit!', evt.currentTarget);
    }, []);

    return (
      <Form>
        <Text field="test"></Text>
        <Button onClick={handleSubmit}>+ Add another gift card</Button>
        <Button onClick={handleSubmit}>Fake other action</Button>
      </Form>
    );
});

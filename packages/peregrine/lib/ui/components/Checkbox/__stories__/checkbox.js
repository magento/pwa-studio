import React from 'react';
import { storiesOf } from '@storybook/react';
import { FormProvider } from 'informed';

import Checkbox from '../checkbox';

const stories = storiesOf('Components/Checkbox', module);

stories.add('Checkbox', () => {
    return (
        <FormProvider initialValues={{ active: true }}>
            <h2>Checkbox Default</h2>
            <Checkbox field={'default'} label={'Option'} />
            <h2>Checkbox Active</h2>
            <Checkbox field={'active'} label={'Active'} />
        </FormProvider>
    );
});

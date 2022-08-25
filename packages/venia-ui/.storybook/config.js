import React from 'react';
import { configure, addDecorator } from '@storybook/react';
import Adapter from '@magento/venia-ui/lib/components/Adapter';
import store from '@magento/venia-concept/src/store';
import '@magento/venia-ui/lib/index.module.css';
import 'tailwindcss/tailwind.css';

function loadStories() {
    const context = require.context('../lib', true, /__stories__\/.+\.js$/);
    context.keys().forEach(context);
}

const origin = process.env.MAGENTO_BACKEND_URL;

addDecorator(storyFn => (
    <Adapter origin={origin} store={store}>
        {storyFn()}
    </Adapter>
));

configure(loadStories, module);

import React from 'react';
import { configure, addDecorator } from '@storybook/react';
import Adapter from '@magento/venia-ui/lib/components/Adapter';
import store from '../store';
import '@magento/venia-ui/lib/index.module.css';
import 'tailwindcss/tailwind.css';

const loadStories = () => {
    // Load all stories from venia-ui
    const veniaContext = require.context(
        '../../node_modules/@magento/venia-ui/lib',
        true,
        /__stories__\/.+\.js$/
    );
    veniaContext.keys().forEach(veniaContext);

    // Load all custom defined stories in src
    const customContext = require.context('..', true, /__stories__\/.+\.js$/);
    customContext.keys().forEach(customContext);
};

const origin = process.env.MAGENTO_BACKEND_URL;

addDecorator(storyFn => (
    <Adapter origin={origin} store={store}>
        {storyFn()}
    </Adapter>
));

configure(loadStories, module);

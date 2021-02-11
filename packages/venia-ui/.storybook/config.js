import React from 'react';
import { configure, addDecorator } from '@storybook/react';
import { Adapter } from '@magento/venia-drivers';
import store from '@magento/venia-concept/src/store';
import { PeregrineContextProvider } from '@magento/peregrine';
import { AppContextProvider } from '@magento/venia-ui/lib/components/App';
import '@magento/venia-ui/lib/index.css';

function loadStories() {
    const context = require.context('../lib', true, /__stories__\/.+\.js$/);
    context.keys().forEach(context);
}

const backendUrl = process.env.MAGENTO_BACKEND_URL;
const apiBase = new URL('/graphql', backendUrl).toString();

addDecorator(storyFn => (
    <Adapter
        apiBase={apiBase}
        apollo={{ link: Adapter.apolloLink(apiBase) }}
        store={store}
    >
        <AppContextProvider>{storyFn()}</AppContextProvider>
    </Adapter>
));

configure(loadStories, module);

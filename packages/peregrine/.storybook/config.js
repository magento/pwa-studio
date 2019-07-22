import { configure } from '@storybook/react';

function loadStories() {
    const context = require.context('../lib', true, /__stories__\/.+\.js$/);
    context.keys().forEach(context);
}

configure(loadStories, module);

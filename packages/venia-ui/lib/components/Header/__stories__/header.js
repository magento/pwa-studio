import React from 'react';
import { storiesOf } from '@storybook/react';
import { IntlProvider } from 'react-intl';

import { ToastContextProvider } from '@magento/peregrine';

import Header from '../header';
import defaultClasses from '../header.css';

const stories = storiesOf('Venia/Header', module);

stories.add('Default', () => {
    return (
        <IntlProvider locale="en-US">
            <ToastContextProvider>
                <Header classes={defaultClasses} />
            </ToastContextProvider>
        </IntlProvider>
    );
});

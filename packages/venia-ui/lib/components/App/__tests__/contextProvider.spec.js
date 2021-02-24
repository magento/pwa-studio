import React from 'react';

import { createTestInstance } from '@magento/peregrine';

import ContextProvider from '../contextProvider';

jest.mock('@magento/peregrine', () => ({
    ...jest.requireActual('@magento/peregrine'),
    PeregrineContextProvider: props => (
        <mock-PeregrineContextProvider {...props} />
    ),
    ToastContextProvider: props => <mock-ToastContextProvider {...props} />,
    WindowSizeContextProvider: props => (
        <mock-WindowSizeContextProvider {...props} />
    )
}));

jest.mock('../localeProvider', () => props => (
    <mock-LocaleProvider {...props} />
));

/* eslint-disable react/jsx-no-literals */
test('should render properly', () => {
    const instance = createTestInstance(
        <ContextProvider>
            <mock-App />
        </ContextProvider>
    );

    expect(instance.toJSON()).toMatchSnapshot();
});
/* eslint-enable react/jsx-no-literals */

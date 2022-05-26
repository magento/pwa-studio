import React from 'react';

import { createTestInstance } from '@magento/peregrine';

import App from '../app';
import AppContainer from '../container';
import { useErrorBoundary } from '../useErrorBoundary';

jest.mock('@magento/peregrine/lib/context/unhandledErrors', () => ({
    useErrorContext: jest.fn().mockReturnValue([
        'unhandledErrors',
        {
            handleErrors: jest.fn().mockName('handleErrors')
        }
    ])
}));

jest.mock('../useErrorBoundary', () => ({
    useErrorBoundary: jest
        .fn()
        .mockReturnValue(props => <mock-ErrorBoundary {...props} />)
}));

jest.mock('../app', () => props => <mock-App {...props} />);

test('should render properly', () => {
    const instance = createTestInstance(<AppContainer />);

    expect(instance.toJSON()).toMatchSnapshot();
    expect(useErrorBoundary).toHaveBeenCalledWith(App);
});

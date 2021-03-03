import React from 'react';

import { createTestInstance } from '@magento/peregrine';

import { useErrorBoundary } from '../useErrorBoundary';

const MockApp = props => <mock-App {...props} />;

test('should render properly', () => {
    const Component = props => {
        const WrappedComponent = useErrorBoundary(MockApp);

        return <WrappedComponent {...props} />;
    };
    const instance = createTestInstance(<Component name="mock-app" />);

    expect(instance.toJSON()).toMatchSnapshot();
});

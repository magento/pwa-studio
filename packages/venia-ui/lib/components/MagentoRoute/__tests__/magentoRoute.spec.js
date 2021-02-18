import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import { useMagentoRoute } from '@magento/peregrine/lib/talons/MagentoRoute';

import MagentoRoute from '../magentoRoute';

jest.mock('@magento/peregrine/lib/talons/MagentoRoute');
jest.mock('@magento/venia-ui/lib/components/ErrorView', () => 'ErrorView');
jest.mock('@magento/venia-ui/lib/components/LoadingIndicator', () => ({
    fullPageLoadingIndicator: 'LoadingIndicator'
}));

test('renders loading indicator while loading', () => {
    useMagentoRoute.mockReturnValue({
        isLoading: true
    });

    const tree = createTestInstance(<MagentoRoute />);

    expect(tree.toJSON()).toMatchInlineSnapshot(`"LoadingIndicator"`);
});

test('renders loading indicator while redirecting', () => {
    useMagentoRoute.mockReturnValue({
        isRedirect: true
    });

    const tree = createTestInstance(<MagentoRoute />);

    expect(tree.toJSON()).toMatchInlineSnapshot(`"LoadingIndicator"`);
});

test('renders component', () => {
    const mockComponent = props => <mock-RootComponent {...props} />;
    useMagentoRoute.mockReturnValue({
        component: mockComponent,
        id: 'component-id-1234'
    });

    const tree = createTestInstance(<MagentoRoute />);

    expect(tree.toJSON()).toMatchInlineSnapshot(`
        <mock-RootComponent
          id="component-id-1234"
        />
    `);
});

test('renders not found', () => {
    useMagentoRoute.mockReturnValue({
        isNotFound: true
    });

    const tree = createTestInstance(<MagentoRoute />);

    expect(tree.toJSON()).toMatchInlineSnapshot(`
        <ErrorView
          message="Looks like the page you were hoping to find doesn't exist. Sorry about that."
        />
    `);
});

test('renders internal error', () => {
    useMagentoRoute.mockReturnValue({});

    const tree = createTestInstance(<MagentoRoute />);

    expect(tree.toJSON()).toMatchInlineSnapshot(`
        <ErrorView
          message="Something went wrong. Sorry about that."
        />
    `);
});

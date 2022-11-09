import React from 'react';
import { act, create } from 'react-test-renderer';
import { usePageLoadingIndicator } from '@magento/peregrine/lib/talons/PageLoadingIndicator/usePageLoadingIndicator';
import PageLoadingIndicator from '../pageLoadingIndicator';

jest.mock(
    '@magento/peregrine/lib/talons/PageLoadingIndicator/usePageLoadingIndicator'
);

jest.mock('../../../classify');

const givenLoadedPage = () => {
    usePageLoadingIndicator.mockImplementation(() => ({
        isPageLoading: false
    }));
};

const givenPageLoading = () => {
    usePageLoadingIndicator.mockImplementation(() => ({
        isPageLoading: true
    }));
};

beforeEach(() => {
    usePageLoadingIndicator.mockClear();
    givenLoadedPage();
});

describe('#PageLoadingIndicator does not render', () => {
    test('when page is not loading', async () => {
        let tree;

        await act(() => {
            tree = create(<PageLoadingIndicator />);
        });

        expect(tree.toJSON()).toBeNull();
    });
});

describe('#PageLoadingIndicator displays correctly depend on the position type', () => {
    test('when absolute is false and page is loading', async () => {
        givenPageLoading();
        let tree;

        await act(() => {
            tree = create(<PageLoadingIndicator />);
        });

        expect(tree.toJSON()).toMatchSnapshot();
    });

    test('when absolute is true and page is not loading', async () => {
        givenLoadedPage();
        let tree;

        await act(() => {
            tree = create(<PageLoadingIndicator absolute />);
        });

        expect(tree.toJSON()).toMatchSnapshot();
    });
});

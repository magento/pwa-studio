import React from 'react';
import { act, create } from 'react-test-renderer';
import usePageLoadingIndicator from '@magento/peregrine/lib/talons/PageLoadingIndicator/usePageLoadingIndicator';
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

describe('#PageLoadingIndicator displays', () => {
    test('when page is loading', async () => {
        givenPageLoading();
        let tree;

        await act(() => {
            tree = create(<PageLoadingIndicator />);
        });

        expect(tree.toJSON()).not.toBeNull();
    });

    test('when absolute is true and page is not loading', async () => {
        givenLoadedPage();
        let tree;

        await act(() => {
            tree = create(<PageLoadingIndicator absolute />);
        });

        expect(tree.toJSON()).not.toBeNull();
    });
});

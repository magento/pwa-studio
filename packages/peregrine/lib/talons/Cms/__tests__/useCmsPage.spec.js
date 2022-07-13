import React from 'react';
import { MockedProvider } from '@apollo/client/testing';
import { act, renderHook } from '@testing-library/react-hooks';
import { useEventingContext } from '@magento/peregrine/lib/context/eventing';

import { useCmsPage } from '../useCmsPage';
import defaultOperations from '../cmsPage.gql';

jest.mock('@magento/peregrine/lib/context/eventing', () => ({
    useEventingContext: jest.fn().mockReturnValue([{}, { dispatch: jest.fn() }])
}));

jest.mock('@magento/peregrine/lib/context/app', () => {
    const state = {};
    const api = { actions: { setPageLoading: jest.fn() } };
    const useAppContext = jest.fn(() => [state, api]);

    return { useAppContext };
});

const getCMSPageQueryMock = {
    request: {
        query: defaultOperations.getCMSPageQuery,
        variables: {
            identifier: 'venia-new-home'
        }
    },
    result: {
        data: {
            cmsPage: {
                url_key: 'venia-new-home',
                content: '<div>Content</div>\n',
                content_heading: 'Heading',
                title: 'Home Page - Venia',
                page_layout: '1column',
                meta_title: 'Meta title',
                meta_keywords: 'Keyword',
                meta_description: 'Venia Sample Home Page'
            }
        }
    }
};

const initialProps = {
    identifier: 'venia-new-home'
};

const renderHookWithProviders = ({
    renderHookOptions = { initialProps },
    mocks = [getCMSPageQueryMock]
} = {}) => {
    const wrapper = ({ children }) => (
        <MockedProvider mocks={mocks} addTypename={false}>
            {children}
        </MockedProvider>
    );
    return renderHook(useCmsPage, { wrapper, ...renderHookOptions });
};

test('should return correct shape', async () => {
    const { result } = renderHookWithProviders();

    await new Promise(resolve => setTimeout(resolve, 0));

    expect(result.current).toMatchSnapshot();
});

test('should return correct shape when loading', () => {
    const { result } = renderHookWithProviders();

    expect(result.current).toMatchSnapshot();
});

test('should dispatch page view event', async () => {
    const mockDispatchEvent = jest.fn();

    useEventingContext.mockReturnValue([
        {},
        {
            dispatch: mockDispatchEvent
        }
    ]);

    renderHookWithProviders();

    await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(mockDispatchEvent).toBeCalledTimes(1);
    expect(mockDispatchEvent.mock.calls[0][0]).toMatchSnapshot();
});

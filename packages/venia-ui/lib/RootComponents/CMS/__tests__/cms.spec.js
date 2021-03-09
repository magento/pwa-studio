import React from 'react';
import createTestInstance from '@magento/peregrine/lib/util/createTestInstance';
import { useQuery } from '@apollo/client';
import CategoryList from '../../../components/CategoryList';
import RichContent from '../../../components/RichContent';
import { StoreTitle } from '../../../components/Head';
import CMSPage from '../cms';
import { useAppContext } from '@magento/peregrine/lib/context/app';

jest.mock('../../../classify');

jest.mock('../../../components/Head', () => ({
    HeadProvider: ({ children }) => <div>{children}</div>,
    StoreTitle: () => 'Title',
    Meta: () => 'Meta'
}));
jest.mock('../../../components/LoadingIndicator', () => {
    return {
        fullPageLoadingIndicator: 'LoadingIndicator'
    };
});
jest.mock('../../../components/RichContent', () => 'RichContent');
jest.mock('../../../components/CategoryList', () => 'CategoryList');

jest.mock('@magento/peregrine/lib/context/app', () => {
    const state = {
        isPageLoading: false
    };
    const api = {
        actions: {
            setPageLoading: jest.fn()
        }
    };
    const useAppContext = jest.fn(() => [state, api]);

    return { useAppContext };
});

jest.mock('@apollo/client', () => {
    const apolloClient = jest.requireActual('@apollo/client');
    const queryResult = {
        data: null,
        error: null,
        loading: false
    };
    const useQuery = jest.fn(() => queryResult);

    return { ...apolloClient, useQuery };
});

const props = {
    id: 1
};

test('fullPageLoadingIndicator is present when loading but no data', () => {
    useQuery.mockImplementation(() => {
        return {
            data: false,
            error: false,
            loading: true
        };
    });

    const { root } = createTestInstance(<CMSPage {...props} />);
    expect(root.children.length).toEqual(1);
    expect(root.children[0]).toEqual('LoadingIndicator');
});

test('page is set to loading when checking the network for updates', () => {
    useQuery.mockImplementation(() => {
        return {
            data: {
                cmsPage: {
                    url_key: 'cached_page',
                    content: 'Cached Page.'
                },
                storeConfig: {
                    root_category_id: 2
                }
            },
            error: false,
            loading: true
        };
    });

    const mockSetPageLoading = jest.fn();
    useAppContext.mockReturnValueOnce([
        {
            isPageLoading: false
        },
        {
            actions: {
                setPageLoading: mockSetPageLoading
            }
        }
    ]);

    createTestInstance(<CMSPage {...props} />);
    expect(mockSetPageLoading).toHaveBeenCalledWith(true);
});

test('render CategoryList when default content is present', () => {
    useQuery.mockImplementation(() => {
        return {
            data: {
                cmsPage: {
                    url_key: 'homepage',
                    content: 'CMS homepage content goes here.'
                },
                storeConfig: {
                    root_category_id: 2
                }
            },
            error: false,
            loading: false
        };
    });

    const { root } = createTestInstance(<CMSPage {...props} />);
    const categoryList = root.findByType(CategoryList);
    expect(categoryList).toBeTruthy();
    expect(categoryList.props.title).toEqual('Shop by category');
    expect(categoryList.props.id).toEqual(2);
});

test('render RichContent when default content is not present', () => {
    useQuery.mockImplementation(() => {
        return {
            data: {
                cmsPage: {
                    url_key: 'homepage',
                    content_heading: 'This is a rich content heading',
                    content:
                        '<div class="richContent">This is rich content</div>'
                },
                storeConfig: {
                    root_category_id: 2
                }
            },
            error: false,
            loading: false
        };
    });

    const { root } = createTestInstance(<CMSPage {...props} />);
    expect(root.findByType(RichContent)).toBeTruthy();

    const contentHeading = root.findByType('h1');
    expect(contentHeading).toBeTruthy();
    expect(contentHeading.props.children).toEqual(
        'This is a rich content heading'
    );
});

test('render meta information based on meta data from GraphQL', () => {
    useQuery.mockImplementation(() => {
        return {
            data: {
                cmsPage: {
                    url_key: 'homepage',
                    content: 'Test Content',
                    title: 'Test Title',
                    meta_title: 'Test Meta Title',
                    meta_description: 'Test Meta Description'
                },
                storeConfig: {
                    root_category_id: 2
                }
            },
            error: false,
            loading: false
        };
    });

    const { root } = createTestInstance(<CMSPage {...props} />);
    const title = root.findByType(StoreTitle);
    expect(title).toBeTruthy();
    expect(title.props.children).toEqual('Test Meta Title');

    const metaTitle = root.findByProps({ name: 'title' });
    expect(metaTitle).toBeTruthy();
    expect(metaTitle.props.content).toEqual('Test Meta Title');

    const metaDescription = root.findByProps({ name: 'description' });
    expect(metaDescription).toBeTruthy();
    expect(metaDescription.props.content).toEqual('Test Meta Description');
});

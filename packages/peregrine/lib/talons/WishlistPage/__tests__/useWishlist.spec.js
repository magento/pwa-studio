import React from 'react';
import { act } from 'react-test-renderer';
import { useLazyQuery } from '@apollo/client';

import createTestInstance from '../../../util/createTestInstance';
import { useWishlist } from '../useWishlist';

jest.mock('../wishlist.gql', () => ({
    getCustomerWishlistItems: jest.fn().mockName('getCustomerWishlistItems')
}));

jest.mock('@apollo/client', () => {
    const queryConfig = {
        called: false,
        data: null,
        loading: false,
        fetchMore: jest.fn()
    };
    const queryFetcher = jest.fn().mockResolvedValue(true);

    return {
        useLazyQuery: jest.fn().mockReturnValue([queryFetcher, queryConfig])
    };
});

const baseProps = {
    id: '5',
    isCollapsed: false,
    itemsCount: 0,
    operations: {
        getCustomerWishlistItems: 'getCustomerWishlistItems'
    }
};

const Component = props => {
    const talonProps = useWishlist({ ...props });
    return <i talonProps={talonProps} />;
};

test('returns correct shape', () => {
    const { root } = createTestInstance(<Component {...baseProps} />);
    const { talonProps } = root.findByType('i').props;

    expect(talonProps).toMatchSnapshot();
});

test('toggles open state', () => {
    const talonPropsResult = [];

    const { root } = createTestInstance(<Component {...baseProps} />);
    talonPropsResult.push(root.findByType('i').props.talonProps);

    act(() => {
        talonPropsResult[0].handleContentToggle();
    });

    talonPropsResult.push(root.findByType('i').props.talonProps);

    act(() => {
        talonPropsResult[1].handleContentToggle();
    });

    talonPropsResult.push(root.findByType('i').props.talonProps);

    expect(talonPropsResult[0].isOpen).toBe(true);
    expect(talonPropsResult[1].isOpen).toBe(false);
    expect(talonPropsResult[2].isOpen).toBe(true);
});

test('should load items if any', () => {
    const props = {
        ...baseProps,
        itemsCount: 1
    };

    useLazyQuery.mockReturnValueOnce([
        jest.fn().mockReturnValueOnce({}),
        {
            called: true,
            loading: false,
            fetchMore: jest.fn(),
            data: {
                customer: {
                    wishlist_v2: {
                        items_v2: {
                            items: [
                                {
                                    name: 'item1'
                                },
                                {
                                    name: 'item2'
                                }
                            ]
                        }
                    }
                }
            }
        }
    ]);

    const { root } = createTestInstance(<Component {...props} />);
    const result = root.findByType('i').props.talonProps;

    expect(result).toMatchSnapshot();
});

test('should fetch more items', () => {
    const props = {
        ...baseProps,
        itemsCount: 21
    };

    const { root } = createTestInstance(<Component {...props} />);
    const result = root.findByType('i').props.talonProps;
    act(() => {
        result.handleLoadMore();
    });

    expect(result).toMatchSnapshot();
});

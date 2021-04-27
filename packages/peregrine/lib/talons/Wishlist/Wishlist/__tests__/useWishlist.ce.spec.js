import React from 'react';
// import { useMutation } from '@apollo/client';

import { useWishlist } from '../useWishlist.ce';
import createTestInstance from '../../../../util/createTestInstance';

jest.mock('@apollo/client', () =>
    jest.fn().mockReturnValue([
        jest.fn(),
        {
            loading: false,
            called: false,
            error: null
        }
    ])
);

const defaultProps = {
    item: {
        sku: 'sku',
        quantity: '1',
        selected_options: 'selected options'
    },
    onWishlistUpdate: jest.fn(),
    onWishlistUpdateError: jest.fn(),
    updateWishlistToastProps: jest.fn()
};

const Component = props => {
    const talonProps = useWishlist(props);

    return <i talonProps={talonProps} />;
};

const getTalonProps = props => {
    const tree = createTestInstance(<Component {...props} />);
    const { root } = tree;
    const { talonProps } = root.findByType('i').props;

    const update = newProps => {
        tree.update(<Component {...{ ...props, ...newProps }} />);

        return root.findByType('i').props.talonProps;
    };

    return { talonProps, tree, update };
};

test('should return correct shape', () => {
    const { talonProps } = getTalonProps(defaultProps);

    expect(talonProps).toMatchSnapshot();
});

// test('handleAddToWishlist')

// test('should use necessary translations', () => {

// })

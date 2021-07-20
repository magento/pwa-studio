import React from 'react';

import createTestInstance from '../../../util/createTestInstance';
import { useAddToCartButton } from '../useAddToCartButton';

jest.mock('@apollo/client', () => ({
    useMutation: jest.fn().mockReturnValue([jest.fn()])
}));

jest.mock('react-router-dom', () => ({
    useHistory: jest.fn().mockReturnValue({ push: jest.fn() })
}));

jest.mock('../../../context/cart', () => ({
    useCartContext: jest.fn().mockReturnValue([{ cartId: '1234' }])
}));

jest.mock('../addToCart.gql', () => ({ ADD_ITEM: 'Add Item GQL Mutation' }));

const Component = props => {
    const talonProps = useAddToCartButton(props);

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

const defaultProps = {
    item: {
        stock_status: 'IN_STOCK',
        type_id: 'simple',
        sku: '97ahsf9',
        url_key: 'simple_product.html'
    }
};

test('returns proper shape', () => {
    const { talonProps } = getTalonProps(defaultProps);

    expect(talonProps).toMatchSnapshot();
});

test('returns isDisabled true if product type is virutal', () => {
    const { talonProps } = getTalonProps({
        item: {
            ...defaultProps.item,
            type_id: 'virtual'
        }
    });

    expect(talonProps.isDisabled).toBeTruthy();
});

test('returns isDisabled true if product type is downloadable', () => {});

test('returns isDisabled true if product type is grouped', () => {});

test('returns isDisabled true if product type is bundle', () => {});


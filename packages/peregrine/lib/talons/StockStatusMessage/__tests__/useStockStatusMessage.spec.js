import React from 'react';

import createTestInstance from '../../../util/createTestInstance';
import { useStockStatusMessage } from '../useStockStatusMessage';

const Component = props => {
    const talonProps = useStockStatusMessage(props);

    return <i talonProps={talonProps} />;
};

test('finds out of stock product', () => {
    const props = {
        cartItems: [
            { product: { stock_status: 'IN_STOCK' } },
            { product: { stock_status: 'OUT_OF_STOCK' } }
        ]
    };

    const tree = createTestInstance(<Component {...props} />);
    const { root } = tree;
    const { talonProps } = root.findByType('i').props;

    expect(talonProps).toMatchSnapshot();
});

test('does not find out of stock product', () => {
    const props = {
        cartItems: [
            { product: { stock_status: 'IN_STOCK' } },
            { product: { stock_status: 'IN_STOCK' } }
        ]
    };

    const tree = createTestInstance(<Component {...props} />);
    const { root } = tree;
    const { talonProps } = root.findByType('i').props;

    expect(talonProps).toMatchSnapshot();
});

test('returns undefined with no products', () => {
    const tree = createTestInstance(<Component />);
    const { root } = tree;
    const { talonProps } = root.findByType('i').props;

    expect(talonProps).toMatchSnapshot();
});

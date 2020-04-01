import React from 'react';

import createTestInstance from '@magento/peregrine/lib/util/createTestInstance';

import Item from '../item';

jest.mock('../../../MiniCart/productOptions', () => {
    const ProductOptions = () => <div>Sample Product Options Component</div>;

    return ProductOptions;
});

jest.mock('../../../Image', () => {
    const Image = () => <div>Sample Image Component</div>;

    return Image;
});

test('Snapshot test', () => {
    const tree = createTestInstance(
        <Item product={{ name: '', thumbnail: { url: '' } }} quantity={5} />
    );

    expect(tree.toJSON()).toMatchSnapshot();
});

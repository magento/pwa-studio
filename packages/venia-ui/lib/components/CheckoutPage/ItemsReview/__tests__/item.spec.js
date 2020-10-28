import React from 'react';

import createTestInstance from '@magento/peregrine/lib/util/createTestInstance';

import Item from '../item';

jest.mock('../../../LegacyMiniCart/productOptions', () => props => (
    <mock-ProductOptions {...props} />
));

jest.mock('../../../Image', () => props => <mock-Image {...props} />);

test('Snapshot test', () => {
    const tree = createTestInstance(
        <Item product={{ name: '', thumbnail: { url: '' } }} quantity={5} />
    );

    expect(tree.toJSON()).toMatchSnapshot();
});

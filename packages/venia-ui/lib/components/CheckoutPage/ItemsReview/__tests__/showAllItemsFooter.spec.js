import React from 'react';

import createTestInstance from '@magento/peregrine/lib/util/createTestInstance';

import ShowAllItemsFooter from '../showAllItemsFooter';

test('Snapshot test', () => {
    const tree = createTestInstance(
        <ShowAllItemsFooter onFooterClick={() => {}} />
    );

    expect(tree.toJSON()).toMatchSnapshot();
});

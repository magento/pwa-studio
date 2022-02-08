import React from 'react';

import { createTestInstance } from '@magento/peregrine';

import GiftCardSummary from '../giftCardSummary.mos';

const Component = () => {
    return <GiftCardSummary />;
};

describe('#GiftCardSummary MOS', () => {
    it('renders', () => {
        const tree = createTestInstance(<Component />);

        expect(tree.toJSON()).toMatchSnapshot();
    });
});

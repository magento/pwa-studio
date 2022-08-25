import React from 'react';

import { createTestInstance } from '@magento/peregrine';

import GiftCardSummary from '../giftCardSummary.ce';

const Component = () => {
    return <GiftCardSummary />;
};

describe('#GiftCardSummary MOS', () => {
    it('renders', () => {
        const tree = createTestInstance(<Component />);

        expect(tree.toJSON()).toMatchSnapshot();
    });
});

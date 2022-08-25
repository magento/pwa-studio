import React from 'react';

import { createTestInstance } from '@magento/peregrine';

import GiftOptionsSummary from '../giftOptionsSummary.ce';

const Component = () => {
    return <GiftOptionsSummary />;
};

describe('#GiftOptionsSummary MOS', () => {
    it('renders', () => {
        const tree = createTestInstance(<Component />);

        expect(tree.toJSON()).toMatchSnapshot();
    });
});

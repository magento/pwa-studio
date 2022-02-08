import React from 'react';

import { createTestInstance } from '@magento/peregrine';

import GiftOptionsSection from '../giftOptionsSection.mos';

const Component = () => {
    return <GiftOptionsSection />;
};

describe('#GiftOptionsSection MOS', () => {
    it('renders', () => {
        const tree = createTestInstance(<Component />);

        expect(tree.toJSON()).toMatchSnapshot();
    });
});

import React from 'react';

import { createTestInstance } from '@magento/peregrine';

import GiftOptionsSection from '../giftOptionsSection.ce';

const Component = () => {
    return <GiftOptionsSection />;
};

describe('#GiftOptionsSection CE', () => {
    it('renders', () => {
        const tree = createTestInstance(<Component />);

        expect(tree.toJSON()).toMatchSnapshot();
    });
});

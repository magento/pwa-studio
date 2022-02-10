import React from 'react';

import { createTestInstance } from '@magento/peregrine';

import DynamicBlock from '../dynamicBlock.ce';

const Component = () => {
    return <DynamicBlock />;
};

describe('#PageBuilder DynamicBlock MOS', () => {
    it('renders', () => {
        const tree = createTestInstance(<Component />);

        expect(tree.toJSON()).toMatchSnapshot();
    });
});

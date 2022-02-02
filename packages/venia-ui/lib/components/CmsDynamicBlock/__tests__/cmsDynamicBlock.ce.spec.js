import React from 'react';

import { createTestInstance } from '@magento/peregrine';

import CmsDynamicBlock from '../cmsDynamicBlock.ce';

const Component = () => {
    return <CmsDynamicBlock />;
};

describe('#CmsDynamicBlock CE', () => {
    it('renders', () => {
        const tree = createTestInstance(<Component />);

        expect(tree.toJSON()).toMatchSnapshot();
    });
});

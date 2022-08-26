import React from 'react';

import { createTestInstance } from '@magento/peregrine';
import { DISPLAY_MODE_FIXED_TYPE } from '@magento/venia-ui/lib/components/CmsDynamicBlock';

import DynamicBlock from '../dynamicBlock.ee';

jest.mock('@magento/venia-ui/lib/components/CmsDynamicBlock', () => props => (
    <mock-CmsDynamicBlockGroup {...props} />
));

const defaultProps = {
    displayInline: false,
    displayMode: DISPLAY_MODE_FIXED_TYPE,
    uids: 'uids',
    textAlign: 'right',
    border: 'solid',
    borderColor: 'red',
    borderWidth: '10px',
    borderRadius: '15px',
    marginTop: '10px',
    marginRight: '10px',
    marginBottom: '10px',
    marginLeft: '10px',
    minHeight: '40px',
    paddingTop: '10px',
    paddingRight: '10px',
    paddingBottom: '10px',
    paddingLeft: '10px'
};

describe('#PageBuilder DynamicBlock AC', () => {
    it('renders a Dynamic Block component without custom classes', () => {
        const component = createTestInstance(
            <DynamicBlock {...defaultProps} />
        );

        expect(component.toJSON()).toMatchSnapshot();
    });

    it('renders a Dynamic Block component with custom classes', () => {
        const blockProps = {
            ...defaultProps,
            cssClasses: ['test-class']
        };
        const component = createTestInstance(<DynamicBlock {...blockProps} />);

        expect(component.toJSON()).toMatchSnapshot();
    });

    it('renders a Dynamic Block component inlined', () => {
        const blockProps = {
            ...defaultProps,
            displayInline: true
        };
        const component = createTestInstance(<DynamicBlock {...blockProps} />);

        expect(component.toJSON()).toMatchSnapshot();
    });

    it('does not render a Dynamic Block component when no uids are provided', () => {
        const blockProps = {
            ...defaultProps,
            uids: undefined
        };
        const component = createTestInstance(<DynamicBlock {...blockProps} />);

        expect(component.toJSON()).toMatchSnapshot();
    });
});

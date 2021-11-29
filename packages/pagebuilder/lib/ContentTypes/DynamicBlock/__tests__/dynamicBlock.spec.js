import React from 'react';

import { createTestInstance } from '@magento/peregrine';

import DynamicBlock from '../dynamicBlock';

jest.mock(
    '@magento/venia-ui/lib/components/CmsDynamicBlock/cmsDynamicBlock',
    () => props => <mock-CmsDynamicBlockGroup {...props} />
);

test('renders a Dynamic Block component without custom classes', () => {
    const blockProps = {
        displayMode: 'fixed',
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
        paddingTop: '10px',
        paddingRight: '10px',
        paddingBottom: '10px',
        paddingLeft: '10px'
    };
    const component = createTestInstance(<DynamicBlock {...blockProps} />);

    expect(component.toJSON()).toMatchSnapshot();
});

test('renders a Dynamic Block component with custom classes', () => {
    const blockProps = {
        displayMode: 'fixed',
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
        paddingTop: '10px',
        paddingRight: '10px',
        paddingBottom: '10px',
        paddingLeft: '10px',
        cssClasses: ['test-class']
    };
    const component = createTestInstance(<DynamicBlock {...blockProps} />);

    expect(component.toJSON()).toMatchSnapshot();
});

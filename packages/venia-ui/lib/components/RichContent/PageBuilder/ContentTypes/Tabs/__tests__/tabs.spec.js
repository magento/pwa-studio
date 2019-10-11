import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import Tabs from "../tabs";

jest.mock('@magento/venia-drivers', () => ({
    resourceUrl: jest.fn(src => src)
}));

jest.mock('../../../../../../classify');

test('render tabs with no props', () => {
    const component = createTestInstance(<Tabs />);

    expect(component.toJSON()).toMatchSnapshot();
});

test('render configured tab', () => {
    const tabProps = {
        tabNavigationAlignment: 'right',
        minHeight: '300px',
        defaultIndex: 0,
        headers: ['Tab 1'],
        border: 'solid',
        borderColor: 'red',
        borderWidth: '10px',
        borderRadius: '5px',
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
    const component = createTestInstance(<Tabs {...tabProps}><div>Tab 1 content</div></Tabs>);

    expect(component.toJSON()).toMatchSnapshot();
});

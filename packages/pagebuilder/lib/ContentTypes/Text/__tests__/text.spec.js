import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import Text from '../text';

jest.mock('@magento/venia-ui/lib/classify');

test('renders a Text component', () => {
    const textProps = {
        content: '<p>Test text component.</p>'
    };
    const component = createTestInstance(<Text {...textProps} />);

    expect(component.toJSON()).toMatchSnapshot();
});

test('renders a Text component with all props configured', () => {
    const textProps = {
        content: '<p>Another text component.</p>',
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
    const component = createTestInstance(<Text {...textProps} />);

    expect(component.toJSON()).toMatchSnapshot();
});

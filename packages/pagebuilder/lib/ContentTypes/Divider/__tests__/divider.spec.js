import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import Divider from '../divider';

jest.mock('@magento/venia-ui/lib/classify');

test('renders a Divider component', () => {
    const component = createTestInstance(<Divider />);

    expect(component.toJSON()).toMatchSnapshot();
});

test('renders a Divider component with all props configured', () => {
    const dividerProps = {
        width: '50%',
        color: '#fd870a',
        thickness: '5px',
        textAlign: 'center',
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
    const component = createTestInstance(<Divider {...dividerProps} />);

    expect(component.toJSON()).toMatchSnapshot();
});

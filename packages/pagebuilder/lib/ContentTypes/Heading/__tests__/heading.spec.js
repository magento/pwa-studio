import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import Heading from '../heading';

jest.mock('@magento/venia-ui/lib/classify');

test('renders a Heading component', () => {
    const headingProps = {
        headingType: 'h2',
        text: 'Testing Heading'
    };
    const component = createTestInstance(<Heading {...headingProps} />);

    expect(component.toJSON()).toMatchSnapshot();
});

test('renders a Heading component with all props configured', () => {
    const headingProps = {
        headingType: 'h1',
        text: 'Configured Heading',
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
        cssClasses: ['test-class', 'test-class2']
    };
    const component = createTestInstance(<Heading {...headingProps} />);

    expect(component.toJSON()).toMatchSnapshot();
});

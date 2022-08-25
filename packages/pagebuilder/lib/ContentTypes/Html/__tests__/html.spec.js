import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import Html from '../html';

jest.mock('@magento/venia-ui/lib/classify');

jest.mock('../../../handleHtmlContentClick');
import handleHtmlContentClick from '../../../handleHtmlContentClick';

jest.mock('react-router-dom', () => {
    return {
        useHistory: jest.fn()
    };
});

test('renders a html component', () => {
    const component = createTestInstance(<Html />);

    expect(component.toJSON()).toMatchSnapshot();
});

test('renders a html component with all props configured', () => {
    const htmlProps = {
        html: '<button>Html button</button>',
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
    const component = createTestInstance(<Html {...htmlProps} />);

    expect(component.toJSON()).toMatchSnapshot();
});

test('on click calls the HTML content click handler', () => {
    const htmlProps = {
        html: '<p>Hello world</p>'
    };
    const mockHtmlContentClick = jest.fn();
    handleHtmlContentClick.mockImplementation(mockHtmlContentClick);

    const event = {
        target: {
            tagName: 'P'
        },
        preventDefault: jest.fn()
    };

    const component = createTestInstance(<Html {...htmlProps} />);

    const htmlElement = component.root.find(instance => {
        return instance.props.dangerouslySetInnerHTML;
    });

    htmlElement.props.onClick(event);

    expect(mockHtmlContentClick).toHaveBeenCalled();
});

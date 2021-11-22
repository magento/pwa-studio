import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import Text from '../text';

jest.mock('@magento/venia-ui/lib/classify');

jest.mock('react-router-dom', () => {
    return {
        useHistory: jest.fn()
    };
});

jest.mock('../../../handleHtmlContentClick');
import handleHtmlContentClick from '../../../handleHtmlContentClick';

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

test('on click calls the HTML content click handler', () => {
    const textProps = {
        content: '<p>Test text component.</p>'
    };

    const mockHtmlContentClick = jest.fn();
    handleHtmlContentClick.mockImplementation(mockHtmlContentClick);

    const event = {
        target: {
            tagName: 'P'
        },
        preventDefault: jest.fn()
    };

    const component = createTestInstance(<Text {...textProps} />);

    const htmlElement = component.root.find(instance => {
        return instance.props.dangerouslySetInnerHTML;
    });

    htmlElement.props.onClick(event);

    expect(mockHtmlContentClick).toHaveBeenCalled();
});

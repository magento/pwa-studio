import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import RichContent from '../richContent';

jest.mock('../PageBuilder/config', () => {
    return () => {
        return {
            configAggregator: () => {},
            component: ({ contentType, children }) => (
                <div dataContentType={contentType}>{children}</div>
            )
        };
    };
});

test('renders a RichContent component', () => {
    const component = createTestInstance(<RichContent />);

    expect(component.toJSON()).toMatchSnapshot();
});

test('renders a RichContent component with Page Builder content', () => {
    const richContentProps = {
        html:
            '<div data-content-type="row" data-appearance="contained" data-element="main"><div data-enable-parallax="0" data-parallax-speed="0.5" data-background-images="{}" data-element="inner" style="justify-content: flex-start; display: flex; flex-direction: column; background-position: left top; background-size: cover; background-repeat: no-repeat; background-attachment: scroll; border-style: solid; border-color: rgb(255, 0, 0); border-width: 5px; border-radius: 2px; margin: 0px 0px 10px; padding: 10px;"></div></div>'
    };
    const component = createTestInstance(<RichContent {...richContentProps} />);

    expect(component.toJSON()).toMatchSnapshot();
});

test('renders a RichContent component with HTML content', () => {
    const richContentProps = {
        html: '<h1>Testing HTML content</h1>'
    };
    const component = createTestInstance(<RichContent {...richContentProps} />);

    expect(component.toJSON()).toMatchSnapshot();
});

import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import Block from '../block';

jest.mock('../../../classify');

test('renders a Block component', () => {
    const blockProps = {
        content: ''
    };
    const component = createTestInstance(<Block {...blockProps} />);

    expect(component.toJSON()).toMatchSnapshot();
});

test('renders a Block component with all props configured and Page Builder rich content', () => {
    const blockProps = {
        content:
            '<div data-content-type="row" data-appearance="contained" data-element="main"><div data-enable-parallax="0" data-parallax-speed="0.5" data-background-images="{}" data-element="inner" style="justify-content: flex-start; display: flex; flex-direction: column; background-position: left top; background-size: cover; background-repeat: no-repeat; background-attachment: scroll; border-style: solid; border-color: rgb(255, 0, 0); border-width: 5px; border-radius: 2px; margin: 0px 0px 10px; padding: 10px;"></div></div>'
    };
    const component = createTestInstance(<Block {...blockProps} />);

    expect(component.toJSON()).toMatchSnapshot();
});

test('renders a Block component with HTML content', () => {
    const blockProps = {
        content: '<h1>Testing HTML content</h1>'
    };
    const component = createTestInstance(<Block {...blockProps} />);

    expect(component.toJSON()).toMatchSnapshot();
});

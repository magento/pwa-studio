import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import RichContent from '../richContent';

// mock the part of the build where venia-ui/targets/intercept.js adds
// plainHtmlRenderer through its own richContentRenderers target
jest.mock('../richContentRenderers', () => [require('../plainHtmlRenderer')]);

test('renders a RichContent component', () => {
    const component = createTestInstance(<RichContent />);

    expect(component.toJSON()).toMatchSnapshot();
});

test('renders a RichContent component with HTML content', () => {
    const richContentProps = {
        html: '<h1>Testing HTML content</h1>'
    };
    const component = createTestInstance(<RichContent {...richContentProps} />);

    expect(component.toJSON()).toMatchSnapshot();
});

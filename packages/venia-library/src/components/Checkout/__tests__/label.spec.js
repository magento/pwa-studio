import React from 'react';
import testRenderer from 'react-test-renderer';
import Label from '../label';

jest.mock('src/classify');

test('renders a Label component as span if plain is true', () => {
    const props = {
        plain: true
    };
    const component = testRenderer.create(<Label {...props} />);
    expect(component.toJSON()).toMatchSnapshot();
});

test('renders a Label component as label if plain is false', () => {
    const props = {
        plain: false
    };
    const component = testRenderer.create(<Label {...props} />);
    expect(component.toJSON()).toMatchSnapshot();
});

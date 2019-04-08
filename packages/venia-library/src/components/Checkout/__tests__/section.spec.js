import React from 'react';
import testRenderer from 'react-test-renderer';
import Section from '../section';
import Icon from 'src/components/Icon';

test('renders a Section component', () => {
    const component = testRenderer.create(<Section />);
    expect(component.toJSON()).toMatchSnapshot();
});

test('renders with icon if showEditIcon is true', () => {
    const component = testRenderer.create(<Section showEditIcon={true} />);
    expect(() => component.root.findByType(Icon)).not.toThrow();
});

test('renders without icon if showEditIcon is false', () => {
    const component = testRenderer.create(<Section showEditIcon={false} />);
    expect(() => component.root.findByType(Icon)).toThrow();
});

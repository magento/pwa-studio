import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import fromRenderProp, { filterProps } from '../fromRenderProp';

const renderer = new ShallowRenderer();

test('returns a component', () => {
    const Div = fromRenderProp('div');

    expect(Div).toBeInstanceOf(Function);
});

test('returns a basic component that renders', () => {
    const child = 'foo';
    const Div = fromRenderProp('div');
    renderer.render(<Div>{child}</Div>);
    const wrapper = renderer.getRenderOutput();

    expect(wrapper.props.children).toBe(child);
});

test('returns a composite component that renders', () => {
    const child = 'foo';
    const Foo = props => <div {...props} />;
    const WrappedFoo = fromRenderProp(Foo);
    renderer.render(<WrappedFoo>{child}</WrappedFoo>);
    const wrapper = renderer.getRenderOutput();

    expect(wrapper.props.children).toBe(child);
});

test('excludes custom props for a basic component', () => {
    const Div = fromRenderProp('div', ['foo']);
    renderer.render(<Div foo="bar" />);
    const wrapper = renderer.getRenderOutput();

    expect(wrapper.props.foo).toBeUndefined();
});

test('includes custom props for a composite component', () => {
    const Foo = props => <div {...props} />;
    const WrappedFoo = fromRenderProp(Foo, ['foo']);
    renderer.render(<WrappedFoo foo="bar" />);
    const wrapper = renderer.getRenderOutput();

    expect(wrapper.props.foo).toBe('bar');
});

test('`filterProps` returns an object', () => {
    expect(filterProps()).toEqual({});
});

test('`filterProps` filters properties from an object', () => {
    const input = { a: 0, b: 1 };
    const output = { b: 1 };
    const excludedProps = ['a'];

    expect(filterProps(input, excludedProps)).toEqual(output);
});

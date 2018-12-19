import React from 'react';
import TestRenderer from 'react-test-renderer';
import { Form } from 'informed';

import Checkbox from '../checkbox';

const field = 'a';
const label = 'b';
const classes = ['icon', 'input', 'label', 'message', 'root'].reduce(
    (acc, key) => ({ ...acc, [key]: key }),
    {}
);

const props = { classes, field, label };

test('renders the correct tree', () => {
    const tree = TestRenderer.create(
        <Form>
            <Checkbox {...props} />
        </Form>
    ).toJSON();

    expect(tree).toMatchSnapshot();
});

test('applies `props.id` to both label and input', () => {
    const id = 'c';

    const instance = TestRenderer.create(
        <Form>
            <Checkbox {...props} id={id} />
        </Form>
    ).root;

    const labelInstance = instance.findByProps({ className: 'root' });
    const checkboxInstance = instance.findByProps({ className: 'input' });

    expect(checkboxInstance.props.id).toBe(id);
    expect(labelInstance.props.htmlFor).toBe(id);
    expect(labelInstance.props.id).toBeUndefined();
});

test('applies `checked` based on `initialValue`', () => {
    const instance = TestRenderer.create(
        <Form>
            <Checkbox {...props} field={'a.x'} initialValue={true} />
            <Checkbox {...props} field={'a.y'} initialValue={false} />
        </Form>
    ).root;

    const [x, y] = instance.findAllByType('input');

    expect(x.props.checked).toBe(true);
    expect(y.props.checked).toBe(false);
});

test('renders an error message if it exists', () => {
    let api;
    const error = 'error';

    const instance = TestRenderer.create(
        <Form>
            {({ formApi }) => {
                api = formApi;
                return <Checkbox {...props} />;
            }}
        </Form>
    ).root;

    api.setError(field, error);
    const messageInstance = instance.findByProps({ children: error });

    expect(messageInstance.props.children).toBe(error);
});

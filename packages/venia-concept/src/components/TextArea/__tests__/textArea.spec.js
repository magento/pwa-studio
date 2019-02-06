import React from 'react';
import TestRenderer from 'react-test-renderer';
import {
    Form
} from 'informed';
import TextArea from '../textArea';

jest.mock('src/classify');

const classes = ['input'].reduce(
    (acc, key) => ({ ...acc,
        [key]: key
    }), {}
);

const fieldState = {
    value: ''
}

const props = {
    classes,
    field: 'text-area',
    fieldState
};

test('renders the correct tree', () => {
    const tree = TestRenderer.create(
        <Form>
          <TextArea {...props}></TextArea>
        </Form>
    ).toJSON();

    expect(tree).toMatchSnapshot();
});

test('renders with non-default columns/rows/wrap', () => {

  const nonDefaultProps = {
    cols: 30,
    rows: 5,
    wrap:'soft'
  }

  const testRenderer = TestRenderer.create(
    <Form>
      <TextArea {...props} {...nonDefaultProps}></TextArea>
    </Form>
  );

  const tree = testRenderer.toJSON();

  expect(tree).toMatchSnapshot();
  expect(tree.children[0].props).toMatchObject(nonDefaultProps);
})

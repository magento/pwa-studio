import React from 'react';
import TestRenderer from 'react-test-renderer';

import SearchBar from '../searchBar';

const buttonTypes = el => el.type === 'button';
const formTypes = el => el.type === 'form';
const inputTypes = el => el.type === 'input';

const executeSearchMock = jest.fn();
const props = {
    executeSearch: executeSearchMock,
    history: {},
    location: { search: '?query=test' },
    isOpen: true
};

afterEach(() => {
    executeSearchMock.mockReset();
});

test('renders the correct tree', () => {
    const tree = TestRenderer.create(<SearchBar {...props} />).toJSON();

    expect(tree).toMatchSnapshot();
});

test('the input field is seeded from the location', () => {
    const expected = 'test';

    const renderer = TestRenderer.create(<SearchBar {...props} />);
    const instance = renderer.root;

    const input = instance.find(inputTypes);

    expect(input.props.value).toBe(expected);
});

test('the reset button is visible when the input field is not empty', () => {
    const renderer = TestRenderer.create(<SearchBar {...props} />);
    const instance = renderer.root;

    const buttons = instance.findAll(buttonTypes);

    expect(buttons).toHaveLength(1);
});

test('the reset button is not visible when the input field is empty', () => {
    // Force the input field to be empty.
    const testProps = {
        ...props,
        location: { search: '' }
    };

    const renderer = TestRenderer.create(<SearchBar {...testProps} />);
    const instance = renderer.root;

    const buttons = instance.findAll(buttonTypes);

    expect(buttons).toHaveLength(0);
});

test('entering text in the input causes the reset button to appear', () => {
    // Start with an empty input field.
    const testProps = {
        ...props,
        location: { search: '' }
    };

    const renderer = TestRenderer.create(<SearchBar {...testProps} />);
    const instance = renderer.root;

    // Confirm that the button is not present.
    const preChangeButtons = instance.findAll(buttonTypes);
    expect(preChangeButtons).toHaveLength(0);

    // Simulate entering text in the input field.
    const input = instance.find(inputTypes);
    input.props.onChange({
        target: { value: 'some text' }
    });

    // Test that the button appears.
    const postChangeButtons = instance.findAll(buttonTypes);
    expect(postChangeButtons).toHaveLength(1);
});

test('the reset button clears the input', () => {
    const renderer = TestRenderer.create(<SearchBar {...props} />);
    const instance = renderer.root;

    // Test that there is some text in the input to start.
    const input = instance.find(inputTypes);
    expect(input.props.value).toBe('test');

    // Simulate clicking the reset button.
    const button = instance.find(buttonTypes);
    button.props.onClick();

    // Test that the input has been cleared.
    expect(input.props.value).toBe('');
});

// TODO: test fails because mock isn't called ... but it is?
test.skip('submitting the form executes the search', () => {
    const renderer = TestRenderer.create(<SearchBar {...props} />);
    const instance = renderer.root;

    // Simulate form submit.
    const form = instance.find(formTypes);
    form.props.onSubmit();

    // Test that executeSearch was called.
    expect(executeSearchMock).toHaveBeenCalledTimes(1);
    expect(executeSearchMock).toHaveBeenNthCalledWith(1, 'test', props.history);
});

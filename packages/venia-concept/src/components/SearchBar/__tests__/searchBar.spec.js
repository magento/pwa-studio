import React from 'react';
import TestRenderer from 'react-test-renderer';

import { Form } from 'informed';
import TextInput from 'src/components/TextInput';
import SearchBar from '../searchBar';
import SearchAutocomplete from '../autocomplete';

const removeEventListenerMock = jest.fn();
Object.defineProperty(window.document, 'removeEventListener', {
    writable: true,
    configurable: true
});
window.document.removeEventListener = removeEventListenerMock;

const buttonTypes = el => el.type === 'button';
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

afterAll(() => {
    afterAll(() => window.document.removeEventListener.mockRestore());
});

test('renders the correct tree', () => {
    const tree = TestRenderer.create(<SearchBar {...props} />).toJSON();

    expect(tree).toMatchSnapshot();
});

test('renders the correct tree', () => {
    const newProps = {
        ...props,
        isOpen: false
    };
    const tree = TestRenderer.create(<SearchBar {...newProps} />).toJSON();

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

    // Test that the input has been cleared and autocomplete is closed.
    expect(input.props.value).toBe('');
    expect(
        instance.findByType(SearchAutocomplete).props.autocompleteVisible
    ).toBe(false);
});

test('submitting the form executes the search', () => {
    const renderer = TestRenderer.create(<SearchBar {...props} />);
    const instance = renderer.root;

    // Simulate form submit.
    const form = instance.findByType(Form);

    form.props.onSubmit({});
    expect(executeSearchMock).not.toHaveBeenCalled();

    form.props.onSubmit({
        search_query: 'test'
    });

    // Test that executeSearch was called.
    expect(executeSearchMock).toHaveBeenCalledTimes(1);
    expect(executeSearchMock).toHaveBeenNthCalledWith(1, 'test', props.history);
});

test('focusing on the text input sets state.autocompleteVisible true', () => {
    const renderer = TestRenderer.create(<SearchBar {...props} />);
    const instance = renderer.root;
    const setStateMock = jest.fn();
    instance.children[0].instance.setState = setStateMock;

    const input = instance.findByType(TextInput);
    input.props.onFocus();

    expect(setStateMock).toHaveBeenCalled();
    expect(setStateMock).toHaveBeenCalledWith({
        autocompleteVisible: true
    });
});

test('handles clicks inside and out of autocomplete input', () => {
    const renderer = TestRenderer.create(<SearchBar {...props} />);
    const instance = renderer.root;
    const setStateMock = jest.fn();

    instance.children[0].instance.searchRef.current = {};
    instance.children[0].instance.autocompleteRef.current = {};

    instance.children[0].instance.setState = setStateMock;
    instance.children[0].instance.searchRef.current.contains = jest
        .fn()
        .mockReturnValue(true);
    instance.children[0].instance.autocompleteRef.current.contains = jest
        .fn()
        .mockReturnValue(false);

    instance.children[0].instance.autocompleteClick({
        target: ''
    });

    expect(setStateMock).not.toHaveBeenCalled();

    instance.children[0].instance.searchRef.current.contains = jest
        .fn()
        .mockReturnValue(false);
    instance.children[0].instance.autocompleteRef.current.contains = jest
        .fn()
        .mockReturnValue(true);

    instance.children[0].instance.autocompleteClick({
        target: ''
    });

    expect(setStateMock).not.toHaveBeenCalled();

    instance.children[0].instance.searchRef.current.contains = jest
        .fn()
        .mockReturnValue(false);
    instance.children[0].instance.autocompleteRef.current.contains = jest
        .fn()
        .mockReturnValue(false);

    instance.children[0].instance.autocompleteClick({
        target: ''
    });

    expect(setStateMock).toHaveBeenCalledWith({
        autocompleteVisible: false
    });
});

test('removes mousedown event listener', () => {
    const renderer = TestRenderer.create(<SearchBar {...props} />);
    const instance = renderer.root;

    instance.children[0].instance.autocompleteClick = jest.fn();

    instance.children[0].instance.componentWillUnmount();

    expect(removeEventListenerMock).toHaveBeenCalledWith(
        'mousedown',
        instance.children[0].instance.autocompleteClick,
        false
    );
});

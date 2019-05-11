import React from 'react';
import { Form } from 'informed';
import { act } from 'react-test-renderer';
import { createTestInstance } from '@magento/peregrine';

import Autocomplete from '../autocomplete';
import SearchBar from '../searchBar';
import SearchField from '../searchField';

jest.mock('src/classify');
jest.mock('../autocomplete', () => () => null);
jest.mock('../searchField', () => () => null);

const mockHistory = {
    push: jest.fn()
};

test('renders correctly', () => {
    const { root } = createTestInstance(
        <SearchBar history={{}} isOpen={false} location={{}} />
    );

    expect(root.findByProps({ className: 'root' })).toBeTruthy();
    expect(root.findByProps({ className: 'container' })).toBeTruthy();
    expect(root.findByProps({ className: 'form' })).toBeTruthy();
    expect(root.findByProps({ className: 'search' })).toBeTruthy();
    expect(root.findByProps({ className: 'autocomplete' })).toBeTruthy();
});

test('sets different classnames when open', () => {
    const { root } = createTestInstance(
        <SearchBar history={{}} isOpen={true} location={{}} />
    );

    expect(root.findAllByProps({ className: 'root' })).toHaveLength(0);
    expect(root.findByProps({ className: 'root_open' })).toBeTruthy();
});

test('expands or collapses on change, depending on the value', () => {
    const { root } = createTestInstance(
        <SearchBar history={{}} isOpen={false} location={{}} />
    );

    expect(root.findByType(Autocomplete).props.visible).toBe(false);

    act(() => {
        root.findByType(SearchField).props.onChange('foo');
    });

    expect(root.findByType(Autocomplete).props.visible).toBe(true);

    act(() => {
        root.findByType(SearchField).props.onChange('');
    });

    expect(root.findByType(Autocomplete).props.visible).toBe(false);
});

test('expands on focus', () => {
    const { root } = createTestInstance(
        <SearchBar history={{}} isOpen={false} location={{}} />
    );

    expect(root.findByType(Autocomplete).props.visible).toBe(false);

    act(() => {
        root.findByType(SearchField).props.onFocus();
    });

    expect(root.findByType(Autocomplete).props.visible).toBe(true);
});

test('navigates on submit', () => {
    const { root } = createTestInstance(
        <SearchBar history={mockHistory} isOpen={false} location={{}} />
    );

    const inputString = 'foo';

    act(() => {
        root.findByType(Form).props.onSubmit({
            search_query: inputString
        });
    });

    expect(mockHistory.push).toHaveBeenLastCalledWith(
        `/search.html?query=${inputString}`
    );
});

import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import SearchAutocomplete from '../autocomplete';

const debounceTimer = 200;

jest.mock('lodash/debounce', debounceTimer =>
    jest.fn(fn => setTimeout(() => fn, debounceTimer))
);

configure({ adapter: new Adapter() });

jest.useFakeTimers();

test('Autocomplete query update should be debounced', () => {
    const updateAutocompleteVisible = jest
        .fn()
        .mockImplementationOnce(() => {});
    const initialState = '';
    const testString = 'test';

    const wrapper = shallow(
        <SearchAutocomplete
            searchQuery={initialState}
            autocompleteVisible={true}
            updateAutocompleteVisible={updateAutocompleteVisible}
        />
    ).dive();

    /* Expect component to initialize with empty string */
    expect(wrapper.instance().state.autocompleteQuery).toEqual(initialState);

    wrapper.setProps({ searchQuery: testString });

    /* Expect component not to update right away (debounce) */
    expect(wrapper.instance().state.autocompleteQuery).toEqual(initialState);

    setTimeout(
        () =>
            expect(wrapper.instance().state.autocompleteQuery).toEqual(
                testString
            ),
        debounceTimer
    );
});

test('Autocomplete should not render if autocompleteVisible is set to false', () => {
    const updateAutocompleteVisible = jest
        .fn()
        .mockImplementationOnce(() => {});
    const initialState = '';
    const testString = 'test';

    const wrapper = shallow(
        <SearchAutocomplete
            searchQuery={initialState}
            autocompleteVisible={false}
            updateAutocompleteVisible={updateAutocompleteVisible}
        />
    ).dive();

    wrapper.setProps({ searchQuery: testString });

    setTimeout(
        () => expect(wrapper.instance().render()).toBeNull(),
        debounceTimer
    );
});

test('Autocomplete should not render if searchQuery is null or less than 3 chars long', () => {
    const updateAutocompleteVisible = jest
        .fn()
        .mockImplementationOnce(() => {});
    const initialState = '';
    const testString = 'ab';

    const wrapper = shallow(
        <SearchAutocomplete
            searchQuery={initialState}
            autocompleteVisible={true}
            updateAutocompleteVisible={updateAutocompleteVisible}
        />
    ).dive();
    /* Expect component to return null if search query is null" */
    expect(wrapper.instance().render()).toBeNull();

    wrapper.setProps({ searchQuery: testString });

    setTimeout(
        () => expect(wrapper.instance().render()).toBeNull(),
        debounceTimer
    );
});

test('Autocomplete should render if searchQuery and autocompleteVisible props result in true', () => {
    const updateAutocompleteVisible = jest
        .fn()
        .mockImplementationOnce(() => {});
    const initialState = '';
    const testString = 'test';

    const wrapper = shallow(
        <SearchAutocomplete
            searchQuery={initialState}
            autocompleteVisible={true}
            updateAutocompleteVisible={updateAutocompleteVisible}
        />
    ).dive();

    wrapper.setProps({ searchQuery: testString });

    setTimeout(
        () => expect(wrapper.instance().render()).not.toBeNull(),
        debounceTimer
    );
});

import React from 'react';
import { shallow } from 'enzyme';
import { SearchBar } from '../searchBar';

const classes = {
    searchBlockOpen: 'open',
    searchBlock: 'closed'
};

test('When the search bar is expanded, pressing the Enter key will submit.', async () => {
    const mockExecuteSearch = jest.fn();
    let wrapper = shallow(
        <SearchBar
            classes={classes}
            isOpen={true}
            executeSearch={mockExecuteSearch}
        />
    );

    wrapper.instance().searchRef = { current: { value: 'test' } };
    const searchInput = wrapper.find('input');
    searchInput.simulate('focus');
    searchInput.simulate('keyUp', { key: 'Enter' });
    expect(mockExecuteSearch).toHaveBeenCalled();
});

test('When the search bar is minimized, pressing the Enter key will not submit.', async () => {
    const mockExecuteSearch = jest.fn();
    let wrapper = shallow(
        <SearchBar
            classes={classes}
            isOpen={false}
            executeSearch={mockExecuteSearch}
        />
    );

    wrapper.instance().searchRef = { current: { value: 'test' } };
    const searchInput = wrapper.find('input');
    searchInput.simulate('focus');
    searchInput.simulate('keyUp', { key: 'Enter' });
    expect(mockExecuteSearch).toHaveBeenCalledTimes(0);
});

test('When the search icon is clicked, the query in the input component will be submitted.', async () => {
    const mockExecuteSearch = jest.fn();
    let wrapper = shallow(
        <SearchBar
            classes={classes}
            isOpen={true}
            executeSearch={mockExecuteSearch}
        />
    );

    wrapper.instance().searchRef = { current: { value: 'test' } };
    const searchButton = wrapper.find('button').at(0);
    searchButton.simulate('focus');
    searchButton.simulate('click', { type: 'click' }, { button: '0' });
    expect(mockExecuteSearch).toHaveBeenCalled();
});

test('When the input component is empty, pressing the enter key will not search.', async () => {
    const mockExecuteSearch = jest.fn();
    let wrapper = shallow(
        <SearchBar
            classes={classes}
            isOpen={true}
            executeSearch={mockExecuteSearch}
        />
    );

    wrapper.instance().searchRef = { current: { value: '' } };
    const searchInput = wrapper.find('input');
    searchInput.simulate('focus');
    searchInput.simulate('keyUp', { key: 'Enter' });
    expect(mockExecuteSearch).toHaveBeenCalledTimes(0);
});

test('When the clear button is pressed, any text in the input component is removed.', async () => {
    const mockFocus = jest.fn();
    let wrapper = shallow(<SearchBar classes={classes} isOpen={true} />);

    const searchInput = wrapper.find('input');
    const clearButton = wrapper.find('button').at(1);
    wrapper.instance().searchRef = {
        current: { value: 'test', focus: mockFocus }
    };
    searchInput.simulate('change');
    clearButton.simulate('click');
    expect(wrapper.instance().searchRef.current.value).toBe('');
});

test('When the input component is empty, the clear button is not displayed.', async () => {
    let wrapper = shallow(<SearchBar classes={classes} isOpen={true} />);

    wrapper.instance().searchRef = { current: { value: '' } };

    expect(wrapper.state('showClearIcon')).toBe(false);
});

test('When the input element has text, the clear button is displayed.', async () => {
    const mockEvent = { type: 'keyUp' };
    let wrapper = shallow(<SearchBar classes={classes} isOpen={true} />);

    wrapper.instance().searchRef = { current: { value: 'test' } };
    // Call the onKeyUp event handler directly since we can't alter the ref.
    wrapper.instance().enterSearch(mockEvent);

    expect(wrapper.state('showClearIcon')).toBe(true);
});

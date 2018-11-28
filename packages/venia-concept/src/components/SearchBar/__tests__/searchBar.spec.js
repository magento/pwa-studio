import React from 'react';
import { configure, shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { SearchBar } from '../searchBar';

configure({ adapter: new Adapter() });

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

test('When pathname is directed to search results page, the search input will get its value from the location.', async () => {
    let wrapper = shallow(
        <SearchBar
            classes={classes}
            isOpen={true}
            location={{ pathname: '/search.html', search: '?query=dress' }}
        />,
        { disableLifecycleMethods: true }
    );

    wrapper.instance().searchRef = { current: { value: '' } };
    wrapper.instance().componentDidMount();
    expect(wrapper.instance().searchRef.current.value).toBe('dress');
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
    const mockFocus = jest.fn();
    let wrapper = shallow(
        <SearchBar
            classes={classes}
            isOpen={true}
            location={{ pathname: '/search.html', search: '' }}
        />,
        { disableLifecycleMethods: true }
    );

    wrapper.instance().searchRef = { current: { value: '', focus: mockFocus } };
    wrapper.instance().componentDidMount();
    expect(wrapper.instance().state.isClearIcon).toBeFalsy();
});

test('When text is added to the input component, the clear button will be displayed.', async () => {
    const mockFocus = jest.fn();
    let wrapper = shallow(
        <SearchBar
            classes={classes}
            isOpen={true}
            location={{ pathname: '/search.html', search: '?query=display' }}
        />,
        { disableLifecycleMethods: true }
    );

    wrapper.instance().searchRef = {
        current: { value: 'display', focus: mockFocus }
    };
    wrapper.instance().componentDidMount();
    expect(wrapper.instance().state.isClearIcon).toBeTruthy();
});

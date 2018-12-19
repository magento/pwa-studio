import React from 'react';
import { shallow, mount } from 'enzyme';
import { SearchBar } from '../searchBar';
import { Router } from '@magento/peregrine';

const classes = {
    searchBlockOpen: 'open',
    searchBlock: 'closed',
    clearIcon: 'hidden',
    clearIconOpen: 'visible'
};

/* Using mount to simulate event propagation - submitting via pressing enter in search input */
test('When the search bar is expanded, pressing the Enter key will submit.', async () => {
    const historyMock = { location: { pathname: '' } };
    const mockExecuteSearch = jest.fn();
    let wrapper = mount(
        <Router apiBase="">
            <SearchBar
                executeSearch={mockExecuteSearch}
                history={historyMock}
                classes={classes}
                isOpen={true}
            />
        </Router>
    ).find(SearchBar);
    const searchInput = wrapper.find('input');
    const spy = jest
        .spyOn(wrapper.instance(), 'enterSearch')
        .mockImplementation(event => {
            if (
                event.type === 'submit' &&
                searchInput.instance().value !== ''
            ) {
                return true;
            } else {
                return false;
            }
        });
    wrapper.instance().forceUpdate();
    searchInput.instance().value = 'test';
    searchInput.simulate('change');
    searchInput.simulate('submit');
    expect(spy).toHaveReturnedWith(true);
});

/* Using mount to simulate event propagation - submitting via pressing enter in search input */
test('When the search icon is clicked, the query in the input component will be submitted.', async () => {
    const historyMock = { location: { pathname: '' } };
    const mockExecuteSearch = jest.fn();
    let wrapper = mount(
        <Router apiBase="">
            <SearchBar
                executeSearch={mockExecuteSearch}
                history={historyMock}
                classes={classes}
                isOpen={true}
            />
        </Router>
    ).find(SearchBar);
    const searchInput = wrapper.find('input');
    const searchButton = wrapper.find('button[type="submit"]').at(0);
    const spy = jest
        .spyOn(wrapper.instance(), 'enterSearch')
        .mockImplementation(event => {
            if (
                event.type === 'submit' &&
                searchInput.instance().value !== ''
            ) {
                return true;
            } else {
                return false;
            }
        });
    wrapper.instance().forceUpdate();
    searchInput.instance().value = 'test';
    searchInput.simulate('change');
    searchButton.simulate('submit');
    expect(spy).toHaveReturnedWith(true);
});

/* Using mount to simulate event propagation - submitting via pressing enter in search input */
test('When the input component is empty, search submit will not be called.', async () => {
    const historyMock = { location: { pathname: '' } };
    const mockExecuteSearch = jest.fn();
    let wrapper = mount(
        <Router apiBase="">
            <SearchBar
                executeSearch={mockExecuteSearch}
                history={historyMock}
                classes={classes}
                isOpen={true}
            />
        </Router>
    ).find(SearchBar);

    const spy = jest
        .spyOn(wrapper.instance(), 'enterSearch')
        .mockImplementation(event => {
            if (
                event.type === 'submit' &&
                searchInput.instance().value !== ''
            ) {
                return true;
            } else {
                return false;
            }
        });

    const searchInput = wrapper.find('input');
    const searchForm = wrapper.find('form');
    wrapper.instance().forceUpdate();
    searchInput.simulate('change', { currentTarget: { value: '' } });
    searchForm.simulate('submit', { preventDefault: () => {} });
    expect(spy).toHaveReturnedWith(false);
});

/* Using mount to simulate event propagation - submitting via pressing enter in search input */
test('When the clear button is pressed, any text in the input component is removed.', async () => {
    const mockExecuteSearch = jest.fn();
    const mockFocus = jest.fn();
    const mockExecuteSearch = jest.fn();
    const historyMock = { location: { pathname: '' } };
    let wrapper = mount(
        <Router apiBase="">
            <SearchBar
                executeSearch={mockExecuteSearch}
                history={historyMock}
                classes={classes}
                isOpen={true}
            />
        </Router>
    ).find(SearchBar);

    const searchInput = wrapper.find('input');
    const clearButton = wrapper.find('button').at(1);
    wrapper.instance().searchRef = {
        current: { value: 'test', focus: mockFocus }
    };
    wrapper.instance().forceUpdate();
    searchInput.simulate('change', { currentTarget: { value: 'test' } });
    clearButton.simulate('click', { preventDefault: () => {} });
    expect(searchInput.props().value).toBe('');
});

test('When the input component is empty, the clear button is not displayed.', async () => {
    const mockEvent = { currentTarget: { value: '' } };
    const historyMock = { location: { pathname: '' } };
    const mockExecuteSearch = jest.fn();
    let wrapper = shallow(
        <SearchBar
            executeSearch={mockExecuteSearch}
            history={historyMock}
            classes={classes}
            isOpen={true}
        />
    );
    wrapper.instance().inputChange(mockEvent);

    const clearButton = wrapper.find('button').at(1);

    expect(clearButton.props().className).toBe(classes.clearIcon);
});

test('When the input element has text, the clear button is displayed.', async () => {
    const mockEvent = { currentTarget: { value: 'test' } };
    const mockExecuteSearch = jest.fn();
    const historyMock = { location: { pathname: '' } };
    let wrapper = shallow(
        <SearchBar
            executeSearch={mockExecuteSearch}
            history={historyMock}
            classes={classes}
            isOpen={true}
        />
    );

    wrapper.instance().inputChange(mockEvent);

    const clearButton = wrapper.find('button').at(1);

    expect(clearButton.props().className).toBe(classes.clearIconOpen);
});

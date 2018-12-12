import React from 'react';
import { configure, shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { SearchBar, SeedSearchInput } from '../searchBar';

configure({ adapter: new Adapter() });

const classes = {
    searchBlockOpen: 'open',
    searchBlock: 'closed',
    clearIcon: 'hidden',
    clearIconOpen: 'visible'
};

/* Using mount to simulate event propagation - submitting via native form onsubmit event */
test('When the search bar is expanded, pressing the Enter key will submit.', async () => {
    let wrapper = mount(<SearchBar classes={classes} isOpen={true} />);
    const searchInput = wrapper.find('input');
    const spy = jest
        .spyOn(wrapper.instance(), 'handleSearchSubmit')
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
    searchInput.instance().value = 'a';
    searchInput.simulate('change');
    searchInput.simulate('submit');
    expect(spy).toHaveReturnedWith(true);
});

/* Using mount to simulate event propagation - submitting via native button with type submit */
test('When the search icon is clicked, the query in the input component will be submitted.', async () => {
    let wrapper = mount(<SearchBar classes={classes} isOpen={true} />);
    const searchInput = wrapper.find('input');
    const searchButton = wrapper.find('button[type="submit"]').at(0);
    const spy = jest
        .spyOn(wrapper.instance(), 'handleSearchSubmit')
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
    searchInput.instance().value = 'a';
    searchInput.simulate('change');
    searchButton.simulate('submit');
    expect(spy).toHaveReturnedWith(true);
});

/* Using mount to simulate event propagation - submitting via pressing enter in search input */
test('When the input component is empty, search submit will not be called.', async () => {
    const mockExecuteSearch = jest.fn();
    let wrapper = mount(
        <SearchBar
            classes={classes}
            isOpen={true}
            executeSearch={mockExecuteSearch}
        />
    );

    const spy = jest
        .spyOn(wrapper.instance(), 'handleSearchSubmit')
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

test('When the clear button is pressed, any text in the input component is removed.', async () => {
    const mockFocus = jest.fn();
    let wrapper = shallow(<SearchBar classes={classes} isOpen={true} />);

    const searchInput = wrapper.find('input');
    const clearButton = wrapper.find('button').at(1);
    wrapper.instance().searchRef = {
        current: { value: 'test', focus: mockFocus }
    };
    wrapper.instance().forceUpdate();
    searchInput.simulate('change', { currentTarget: { value: 'test' } });
    clearButton.simulate('click');
    expect(searchInput.props().value).toBe('');
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

describe('SeedSearchInput', () => {
    test('SeedSearchInput sets the ref to the value from the location', async () => {
        const setValueMock = jest.fn();
        const mockRef = {
            current: {
                value: ''
            }
        };
        Object.defineProperty(mockRef.current, 'value', {
            set: setValueMock
        });

        shallow(
            <SeedSearchInput
                location={{ search: '?query=dress' }}
                searchRef={mockRef}
                setClearIcon={jest.fn()}
            />
        );

        expect(setValueMock).toBeCalledWith('dress');
    });
});

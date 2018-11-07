import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { SearchBar } from '../searchBar';

configure({ adapter: new Adapter() });

const classes = {
    searchBlockOpen: 'open',
    searchBlock: 'closed'
};

test('When isOpen is true, the input component is focused.', async () => {
    let wrapper = mount(<SearchBar classes={classes} isOpen={true} />);
    const searchInput = wrapper.find('input').instance();
    spyOn(searchInput, 'focus');
    wrapper.instance().componentDidMount();
    expect(searchInput.focus).toHaveBeenCalledTimes(1);
});

test('When isOpen is false, the input is blurred.', async () => {
    let wrapper = mount(<SearchBar classes={classes} isOpen={false} />);
    const searchInput = wrapper.find('input').instance();
    const prevProps = { isOpen: true };
    spyOn(searchInput, 'blur');
    wrapper.instance().componentDidUpdate(prevProps);
    expect(searchInput.blur).toHaveBeenCalledTimes(1);
});

test('When the search bar is expanded, pressing the Enter key will submit.', async () => {
    let wrapper = mount(<SearchBar classes={classes} isOpen={true} />);
    const searchInput = wrapper.find('input');
    const spy = jest
        .spyOn(wrapper.instance(), 'enterSearch')
        .mockImplementation(event => {
            if (
                (event.type === 'click' || event.key === 'Enter') &&
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
    searchInput.simulate('keyUp', { key: 'Enter' });
    expect(spy).toHaveReturnedWith(true);
});

test('When the search icon is clicked, the query in the input component will be submitted.', async () => {
    let wrapper = mount(<SearchBar classes={classes} isOpen={true} />);
    const searchInput = wrapper.find('input');
    const searchButton = wrapper.find('button').at(0);
    const spy = jest
        .spyOn(wrapper.instance(), 'enterSearch')
        .mockImplementation(event => {
            if (
                (event.type === 'click' || event.key === 'Enter') &&
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
    searchButton.simulate('click');
    expect(spy).toHaveReturnedWith(true);
});

test('When the input component is empty, pressing the enter key will not search.', async () => {
    let wrapper = mount(<SearchBar classes={classes} isOpen={true} />);
    const searchInput = wrapper.find('input');
    const spy = jest
        .spyOn(wrapper.instance(), 'enterSearch')
        .mockImplementation(event => {
            if (
                (event.type === 'click' || event.key === 'Enter') &&
                searchInput.instance().value !== ''
            ) {
                return true;
            } else {
                return false;
            }
        });
    wrapper.instance().forceUpdate();
    searchInput.simulate('change');
    searchInput.simulate('keyUp', { key: 'Enter' });
    expect(spy).toHaveReturnedWith(false);
});

test('When url is pointed to search results page, the search input will get its value from the url.', async () => {
    window.history.pushState({}, 'Search', '/search.html?query=dress');
    let wrapper = mount(<SearchBar classes={classes} isOpen={true} />);
    const searchInput = wrapper.find('input');
    expect(searchInput.instance().value).toBe('dress');
});

test('When the clear button is pressed, any text in the input component is removed.', async () => {
    let wrapper = mount(<SearchBar classes={classes} isOpen={true} />);
    const searchInput = wrapper.find('input');
    const clearButton = wrapper.find('button').at(1);
    wrapper.instance().forceUpdate();
    searchInput.instance().value = 'text';
    searchInput.simulate('change');
    clearButton.simulate('click');
    expect(searchInput.instance().value).toBe('');
});

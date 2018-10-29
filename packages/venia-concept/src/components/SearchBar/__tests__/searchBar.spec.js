import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { SearchBar } from '../searchBar';

configure({ adapter: new Adapter() });

const classes = {
    searchBlockOpen: 'open',
    searchBlock: 'closed'
};

test('Input is focused when isOpen is true', async () => {
    let wrapper = mount(<SearchBar classes={classes} isOpen={true} />);
    const searchInput = wrapper.find('input').instance();
    spyOn(searchInput, 'focus');
    wrapper.instance().forceUpdate();
    wrapper.instance().componentDidMount();
    expect(searchInput.focus).toHaveBeenCalledTimes(1);
});

test('Input is blurred when isOpen is false', async () => {
    let wrapper = mount(<SearchBar classes={classes} isOpen={false} />);
    const searchInput = wrapper.find('input').instance();
    const prevProps = { isOpen: true };
    spyOn(searchInput, 'blur');
    wrapper.instance().forceUpdate();
    wrapper.instance().componentDidUpdate(prevProps);
    expect(searchInput.blur).toHaveBeenCalledTimes(1);
});

test('Enter key to submit while expanded', async () => {
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
    searchInput.simulate('keyPress', { key: 'Enter' });
    expect(spy).toHaveReturnedWith(true);
});

test('Search icon to submit when clicked', async () => {
    let wrapper = mount(<SearchBar classes={classes} isOpen={true} />);
    const searchInput = wrapper.find('input');
    const searchButton = wrapper.find('button');
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

test('Search can not submit when search input empty', async () => {
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
    searchInput.simulate('keyPress', { key: 'Enter' });
    expect(spy).toHaveReturnedWith(false);
});

test('Search gets query from url when provided', async () => {
    window.history.pushState({}, 'Search', '/search?query=backpack');
    let wrapper = mount(<SearchBar classes={classes} isOpen={true} />);
    const searchInput = wrapper.find('input');
    wrapper.instance().forceUpdate();
    expect(searchInput.instance().value).toBe('backpack');
});

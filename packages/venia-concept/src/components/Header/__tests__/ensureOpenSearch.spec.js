import React from 'react';
import { shallow } from 'enzyme';

import EnsureOpenSearch from '../ensureOpenSearch';

test('calls toggleSearch when search is not open', () => {
    const props = {
        searchOpen: false,
        toggleSearch: jest.fn()
    };

    const wrapper = shallow(<EnsureOpenSearch {...props} />);

    expect(props.toggleSearch).toHaveBeenCalledTimes(1);

    // it should not render anything.
    expect(wrapper.html()).toBeNull();
});

test('does not call toggleSearch when search is already open', () => {
    const props = {
        searchOpen: true,
        toggleSearch: jest.fn()
    };

    const wrapper = shallow(<EnsureOpenSearch {...props} />);

    expect(props.toggleSearch).toHaveBeenCalledTimes(0);

    // it should not render anything.
    expect(wrapper.html()).toBeNull();
});

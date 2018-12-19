import React from 'react';
import { shallow } from 'enzyme';

import SeedSearchInput from '../seedSearchInput';

test('calls callback function with test value', () => {
    const mockCallback = jest.fn();

    const props = {
        location: { search: '?query=test' },
        callback: mockCallback
    };

    const wrapper = shallow(<SeedSearchInput {...props} />);

    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenNthCalledWith(1, 'test');

    // Should never render anything.
    expect(wrapper.html()).toBeNull();
});

test('sets ref value to empty string when no "query" query parameter', () => {
    const mockCallback = jest.fn();
    const props = {
        location: { search: '?key=value' },
        callback: mockCallback
    };

    const wrapper = shallow(<SeedSearchInput {...props} />);

    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenNthCalledWith(1, '');

    // Should never render anything.
    expect(wrapper.html()).toBeNull();
});

test('sets ref value to empty string when location.search is empty', () => {
    const mockCallback = jest.fn();
    const props = {
        location: { search: '?key=value' },
        callback: mockCallback
    };

    const wrapper = shallow(<SeedSearchInput {...props} />);

    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenNthCalledWith(1, '');

    expect(wrapper.html()).toBeNull();
});

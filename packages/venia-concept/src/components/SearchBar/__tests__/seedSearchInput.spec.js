import React from 'react';
import { shallow } from 'enzyme';

import SeedSearchInput from '../seedSearchInput';

test('sets ref value to value of "query" query parameter', () => {
    const props = {
        location: { search: '?query=test' },
        searchRef: {
            current: {
                set value(v) {
                    /* purposefully empty */
                }
            }
        },
        setClearIcon: jest.fn()
    };
    // Spy on the `value` setter.
    const valueSpy = jest.spyOn(props.searchRef.current, 'value', 'set');

    const wrapper = shallow(<SeedSearchInput {...props} />);

    expect(valueSpy).toHaveBeenCalledTimes(1);
    expect(valueSpy).toHaveBeenNthCalledWith(1, 'test');

    expect(props.setClearIcon).toHaveBeenCalledTimes(1);
    expect(props.setClearIcon).toHaveBeenNthCalledWith(1, 'test');

    // Should never render anything.
    expect(wrapper.html()).toBeNull();
});

test('sets ref value to empty string when no "query" query parameter', () => {
    const props = {
        location: { search: '?key=value' },
        searchRef: {
            current: {
                set value(v) {
                    /* purposefully empty */
                }
            }
        },
        setClearIcon: jest.fn()
    };
    // Spy on the `value` setter.
    const valueSpy = jest.spyOn(props.searchRef.current, 'value', 'set');

    const wrapper = shallow(<SeedSearchInput {...props} />);

    expect(valueSpy).toHaveBeenCalledTimes(1);
    expect(valueSpy).toHaveBeenNthCalledWith(1, '');

    expect(props.setClearIcon).toHaveBeenCalledTimes(1);
    expect(props.setClearIcon).toHaveBeenNthCalledWith(1, '');

    // Should never render anything.
    expect(wrapper.html()).toBeNull();
});

test('sets ref value to empty string when location.search is empty', () => {
    const props = {
        location: { search: '' },
        searchRef: {
            current: {
                set value(v) {
                    /* purposefully empty */
                }
            }
        },
        setClearIcon: jest.fn()
    };
    // Spy on the `value` setter.
    const valueSpy = jest.spyOn(props.searchRef.current, 'value', 'set');

    const wrapper = shallow(<SeedSearchInput {...props} />);

    expect(valueSpy).toHaveBeenCalledTimes(1);
    expect(valueSpy).toHaveBeenNthCalledWith(1, '');

    expect(props.setClearIcon).toHaveBeenCalledTimes(1);
    expect(props.setClearIcon).toHaveBeenNthCalledWith(1, '');

    // Should never render anything.
    expect(wrapper.html()).toBeNull();
});

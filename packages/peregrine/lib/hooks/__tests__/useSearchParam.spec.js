import React from 'react';

import { useSearchParam } from '../useSearchParam';
import createTestInstance from '../../util/createTestInstance';

const log = jest.fn();
const setValue = jest.fn();

const Component = props => {
    const hookProps = useSearchParam(props);

    log(hookProps);

    return <i />;
};

test('returns undefined', () => {
    createTestInstance(
        <Component
            location={{ search: '?a=b&c=d' }}
            parameter="a"
            setValue={setValue}
        />
    );

    expect(log).toHaveBeenCalledTimes(1);
    expect(log).toHaveBeenNthCalledWith(1, void 0);
});

test('calls `setValue` as an effect', () => {
    createTestInstance(
        <Component
            location={{ search: '?a=b&c=d' }}
            parameter="a"
            setValue={setValue}
        />
    );

    expect(setValue).toHaveBeenCalledTimes(1);
    expect(setValue).toHaveBeenNthCalledWith(1, 'b');
});

test("sets value to empty string if `parameter` isn't found", () => {
    createTestInstance(
        <Component location={{ search: '?a=b&c=d' }} setValue={setValue} />
    );

    expect(setValue).toHaveBeenCalledTimes(1);
    expect(setValue).toHaveBeenNthCalledWith(1, '');
});

test("uses `window.location` if `location` isn't provided", () => {
    window.history.pushState({}, '', '/search.html?a=b&c=d');

    createTestInstance(<Component parameter="c" setValue={setValue} />);

    expect(setValue).toHaveBeenCalledTimes(1);
    expect(setValue).toHaveBeenNthCalledWith(1, 'd');
});

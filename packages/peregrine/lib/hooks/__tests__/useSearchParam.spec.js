import React from 'react';

import { useSearchParam } from '../useSearchParam';
import createTestInstance from '../../util/createTestInstance';

const log = jest.fn();
const setValue = jest.fn();

jest.mock('react-router-dom', () => ({
    useLocation: jest.fn(() => ({ search: '?a=b&c=d' }))
}));

const Component = props => {
    const hookProps = useSearchParam(props);

    log(hookProps);

    return <i />;
};

test('returns undefined', () => {
    createTestInstance(<Component parameter="a" setValue={setValue} />);

    expect(log).toHaveBeenCalledTimes(1);
    expect(log).toHaveBeenNthCalledWith(1, void 0);
});

test('calls `setValue` as an effect', () => {
    createTestInstance(<Component parameter="a" setValue={setValue} />);

    expect(setValue).toHaveBeenCalledTimes(1);
    expect(setValue).toHaveBeenNthCalledWith(1, 'b');
});

test("sets value to empty string if `parameter` isn't found", () => {
    createTestInstance(<Component setValue={setValue} />);

    expect(setValue).toHaveBeenCalledTimes(1);
    expect(setValue).toHaveBeenNthCalledWith(1, '');
});

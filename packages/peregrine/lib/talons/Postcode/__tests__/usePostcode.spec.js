import React from 'react';
import { act } from 'react-test-renderer';
import { useFieldApi, useFieldState } from 'informed';

import createTestInstance from '../../../util/createTestInstance';
import { usePostcode } from '../usePostcode';

jest.mock('informed', () => {
    const useFieldState = jest.fn().mockReturnValue({
        value: 'US'
    });
    const useFieldApi = jest.fn();

    return { useFieldApi, useFieldState };
});

const Component = props => {
    const talonProps = usePostcode(props);
    return <i talonProps={talonProps} />;
};

const props = {
    fieldInput: 'postcode'
};

test('returns an empty object', () => {
    const tree = createTestInstance(<Component {...props} />);
    const { root } = tree;
    const { talonProps } = root.findByType('i').props;

    expect(talonProps).toMatchSnapshot();
});

test('resets value on country change', () => {
    const mockReset = jest.fn();
    const mockExists = jest.fn(() => true);

    useFieldState.mockReturnValueOnce({ value: 'FR' });
    useFieldApi.mockReturnValue({ reset: mockReset, exists: mockExists });

    const tree = createTestInstance(<Component {...props} />);

    expect(mockReset).not.toHaveBeenCalled();

    act(() => {
        tree.update(<Component {...props} />);
    });

    expect(mockReset).toHaveBeenCalled();
});

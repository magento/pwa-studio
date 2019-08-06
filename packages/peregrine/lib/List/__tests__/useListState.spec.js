import { renderHook, act } from '@testing-library/react-hooks';

import { useListState } from '../useListState';

test('testing initialState and its shape', () => {
    const props = { selectionModel: 'radio', onSelectionChange: jest.fn() };
    const {
        result: {
            current: [state, api]
        }
    } = renderHook(() => useListState(props));

    expect(state).toEqual({
        cursor: null,
        hasFocus: false,
        selection: new Set()
    });
    expect(api).toHaveProperty('setFocus');
    expect(api).toHaveProperty('removeFocus');
    expect(api).toHaveProperty('updateSelection');
    expect(typeof api.setFocus).toBe('function');
    expect(typeof api.removeFocus).toBe('function');
    expect(typeof api.updateSelection).toBe('function');
});

test('setFocus should update cursor and hasFocus values inside state', () => {
    const props = { selectionModel: 'radio', onSelectionChange: jest.fn() };
    const { result } = renderHook(() => useListState(props));

    expect(result.current[0].cursor).toBeNull();
    expect(result.current[0].hasFocus).not.toBeTruthy();

    act(() => {
        result.current[1].setFocus('001');
    });

    expect(result.current[0].cursor).toBe('001');
    expect(result.current[0].hasFocus).toBeTruthy();
});

test('removeFocus should set hasFocus value to false leaving cursor untouched', () => {
    const props = { selectionModel: 'radio', onSelectionChange: jest.fn() };
    const { result } = renderHook(() => useListState(props));

    act(() => {
        result.current[1].setFocus('002');
    });

    expect(result.current[0].cursor).toBe('002');
    expect(result.current[0].hasFocus).toBeTruthy();

    act(() => {
        result.current[1].removeFocus();
    });

    expect(result.current[0].cursor).toBe('002');
    expect(result.current[0].hasFocus).not.toBeTruthy();
});

test('updateSelection should replace the selected ID inside selection state when selectionModel is radio', () => {
    const props = {
        selectionModel: 'radio',
        onSelectionChange: jest.fn()
    };
    const { result } = renderHook(() => useListState(props));

    act(() => {
        result.current[1].updateSelection('001');
    });

    expect(result.current[0].selection.has('001')).toBeTruthy();

    act(() => {
        result.current[1].updateSelection('002');
    });

    expect(result.current[0].selection.has('001')).not.toBeTruthy();
    expect(result.current[0].selection.has('002')).toBeTruthy();
});

test('updateSelection should add the new ID into selection state when selectionModel is checkbox', () => {
    const props = { selectionModel: 'checkbox', onSelectionChange: jest.fn() };
    const { result } = renderHook(() => useListState(props));

    act(() => {
        result.current[1].updateSelection('001');
    });

    expect(result.current[0].selection.has('001')).toBeTruthy();

    act(() => {
        result.current[1].updateSelection('002');
    });

    expect(result.current[0].selection.has('001')).toBeTruthy();
    expect(result.current[0].selection.has('002')).toBeTruthy();
});

test('onSelectionChange should be triggered when selection state changes', () => {
    const onSelectionChange = jest.fn();
    const props = { selectionModel: 'radio', onSelectionChange };
    const { result } = renderHook(() => useListState(props));

    expect(onSelectionChange).toHaveBeenCalledWith(new Set());

    act(() => {
        result.current[1].updateSelection('001');
    });

    expect(onSelectionChange).toHaveBeenCalledWith(new Set(['001']));
});

test('if onSelectionChange is not provided, no error should be thrown', () => {
    const props = { selectionModel: 'radio' };

    expect(() => renderHook(() => useListState(props))).not.toThrow();
});

test('ID selection should have toggling behavior when selectionModel is checkbox', () => {
    const props = { selectionModel: 'checkbox', onSelectionChange: jest.fn() };
    const { result } = renderHook(() => useListState(props));

    act(() => {
        result.current[1].updateSelection('001');
    });

    expect(result.current[0].selection.has('001')).toBeTruthy();

    act(() => {
        result.current[1].updateSelection('001');
    });

    expect(result.current[0].selection.has('001')).not.toBeTruthy();
});

test('ID selection should not have toggling behavior when selectionModel is radio', () => {
    const props = { selectionModel: 'radio', onSelectionChange: jest.fn() };
    const { result } = renderHook(() => useListState(props));

    act(() => {
        result.current[1].updateSelection('001');
    });

    expect(result.current[0].selection.has('001')).toBeTruthy();

    act(() => {
        result.current[1].updateSelection('001');
    });

    expect(result.current[0].selection.has('001')).toBeTruthy();
});

test('setFocus and removeFocus should be memoized', () => {
    const initialProps = {
        selectionModel: 'radio',
        onSelectionChange: jest.fn()
    };
    const { result, rerender } = renderHook(props => useListState(props), {
        initialProps
    });
    const oldSetFocus = result.current[1].setFocus;
    const oldRemoveFocus = result.current[1].removeFocus;

    rerender();

    expect(result.current[1].setFocus).toBe(oldSetFocus);
    expect(result.current[1].removeFocus).toBe(oldRemoveFocus);
});

test('updateSelection should get new reference if selectionModel argument changes', () => {
    const initialProps = {
        selectionModel: 'radio',
        onSelectionChange: jest.fn()
    };
    const { result, rerender } = renderHook(props => useListState(props), {
        initialProps
    });
    const oldUpdateSelection = result.current[1].updateSelection;

    rerender({ ...initialProps, selectionModel: 'checkbox' });

    expect(result.current[1].updateSelection).not.toBe(oldUpdateSelection);
});

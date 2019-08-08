import React from 'react';
import { act } from 'react-test-renderer';

import { useListState } from '../useListState';
import createTestInstance from '../../util/createTestInstance';

const log = jest.fn();

const Component = props => {
    const { listStateProps } = props;

    log(useListState(listStateProps));

    return null;
};

test('testing initialState and its shape', () => {
    const props = { selectionModel: 'radio', onSelectionChange: jest.fn() };
    createTestInstance(<Component listStateProps={props} />);
    const [state, api] = log.mock.calls[0][0];

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
    createTestInstance(<Component listStateProps={props} />);
    let [state, api] = log.mock.calls[0][0];

    expect(state.cursor).toBeNull();
    expect(state.hasFocus).not.toBeTruthy();

    api.setFocus('001');
    [state, api] = log.mock.calls[1][0];

    expect(state.cursor).toBe('001');
    expect(state.hasFocus).toBeTruthy();
});

test('removeFocus should set hasFocus value to false leaving cursor untouched', () => {
    const props = { selectionModel: 'radio', onSelectionChange: jest.fn() };
    createTestInstance(<Component listStateProps={props} />);
    let [state, api] = log.mock.calls[0][0];

    api.setFocus('002');
    [state, api] = log.mock.calls[1][0];

    expect(state.cursor).toBe('002');
    expect(state.hasFocus).toBeTruthy();

    api.removeFocus();
    [state, api] = log.mock.calls[2][0];

    expect(state.cursor).toBe('002');
    expect(state.hasFocus).not.toBeTruthy();
});

test('updateSelection should replace the selected ID inside selection state when selectionModel is radio', () => {
    const props = {
        selectionModel: 'radio',
        onSelectionChange: jest.fn()
    };
    createTestInstance(<Component listStateProps={props} />);
    let [state, api] = log.mock.calls[0][0];

    api.updateSelection('001');
    [state, api] = log.mock.calls[1][0];

    expect(state.selection.has('001')).toBeTruthy();

    api.updateSelection('002');
    [state, api] = log.mock.calls[2][0];

    expect(state.selection.has('001')).not.toBeTruthy();
    expect(state.selection.has('002')).toBeTruthy();
});

test('updateSelection should add the new ID into selection state when selectionModel is checkbox', () => {
    const props = { selectionModel: 'checkbox', onSelectionChange: jest.fn() };
    createTestInstance(<Component listStateProps={props} />);
    let [state, api] = log.mock.calls[0][0];

    api.updateSelection('001');
    [state, api] = log.mock.calls[1][0];

    expect(state.selection.has('001')).toBeTruthy();

    api.updateSelection('002');
    [state, api] = log.mock.calls[2][0];

    expect(state.selection.has('001')).toBeTruthy();
    expect(state.selection.has('002')).toBeTruthy();
});

test('onSelectionChange should be triggered when selection state changes', () => {
    const onSelectionChange = jest.fn();
    const props = { selectionModel: 'radio', onSelectionChange };
    createTestInstance(<Component listStateProps={props} />);

    expect(onSelectionChange).toHaveBeenNthCalledWith(1, new Set());

    const [, api] = log.mock.calls[0][0];
    act(() => {
        api.updateSelection('001');
    });

    expect(onSelectionChange).toHaveBeenNthCalledWith(2, new Set(['001']));
});

test('if onSelectionChange is not provided, no error should be thrown', () => {
    const props = { selectionModel: 'radio' };

    expect(() =>
        createTestInstance(<Component listStateProps={props} />)
    ).not.toThrow();
});

test('ID selection should have toggling behavior when selectionModel is checkbox', () => {
    const props = { selectionModel: 'checkbox', onSelectionChange: jest.fn() };
    createTestInstance(<Component listStateProps={props} />);
    let [state, api] = log.mock.calls[0][0];

    api.updateSelection('001');
    [state, api] = log.mock.calls[1][0];

    expect(state.selection.has('001')).toBeTruthy();

    api.updateSelection('001');
    [state, api] = log.mock.calls[2][0];

    expect(state.selection.has('001')).not.toBeTruthy();
});

test('ID selection should not have toggling behavior when selectionModel is radio', () => {
    const props = { selectionModel: 'radio', onSelectionChange: jest.fn() };
    createTestInstance(<Component listStateProps={props} />);
    let [state, api] = log.mock.calls[0][0];

    api.updateSelection('001');
    [state, api] = log.mock.calls[1][0];

    expect(state.selection.has('001')).toBeTruthy();

    api.updateSelection('001');
    [state, api] = log.mock.calls[2][0];

    expect(state.selection.has('001')).toBeTruthy();
});

test('setFocus and removeFocus should be memoized', () => {
    const initialProps = {
        selectionModel: 'radio',
        onSelectionChange: jest.fn()
    };
    const comp = createTestInstance(
        <Component listStateProps={initialProps} />
    );

    comp.update(<Component listStateProps={initialProps} />);

    expect(log.mock.calls[1][0][1].setFocus).toBe(
        log.mock.calls[0][0][1].setFocus
    );
    expect(log.mock.calls[1][0][1].removeFocus).toBe(
        log.mock.calls[0][0][1].removeFocus
    );
});

test('updateSelection should get new reference if selectionModel argument changes', () => {
    const initialProps = {
        selectionModel: 'radio',
        onSelectionChange: jest.fn()
    };
    const comp = createTestInstance(
        <Component listStateProps={initialProps} />
    );

    comp.update(
        <Component
            listStateProps={{ ...initialProps, selectionModel: 'checkbox' }}
        />
    );

    expect(log.mock.calls[1][0][1].updateSelection).not.toBe(
        log.mock.calls[0][0][1].updateSelection
    );
});

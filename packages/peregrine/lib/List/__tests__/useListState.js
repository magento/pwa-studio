import React from 'react';
import { act } from 'react-test-renderer';

import { useListState } from '../useListState';
import createTestInstance from '../../util/createTestInstance';

const log = jest.fn();
const props = {
    getItemKey: jest.fn(() => 'some_value'),
    initialSelection: undefined,
    onSelectionChange: jest.fn(),
    selectionModel: 'radio'
};

const Component = props => {
    const { listStateProps } = props;

    log(useListState(listStateProps));

    return null;
};

test('the shapes of state and api are correct', () => {
    createTestInstance(<Component listStateProps={props} />);

    const [state, api] = log.mock.calls[0][0];

    expect(state).toHaveProperty('cursor');
    expect(state).toHaveProperty('hasFocus');
    expect(state).toHaveProperty('selectedKeys');
    // cursor can be a string or a number.
    expect(state.hasFocus).toBeInstanceOf(Boolean);
    expect(state.selectedKeys).toBeInstanceOf(Set);

    expect(api).toHaveProperty('setFocus');
    expect(api).toHaveProperty('removeFocus');
    expect(api).toHaveProperty('updateSelectedKeys');
    expect(api.setFocus).toBeInstanceOf(Function);
    expect(api.removeFocus).toBeInstanceOf(Function);
    expect(api.updateSelectedKeys).toBeInstanceOf(Function);
});

test('selectedKeys is empty when no initial selection is passed', () => {
    createTestInstance(<Component listStateProps={props} />);

    const [state] = log.mock.calls[0][0];
    const { selectedKeys } = state;

    expect(selectedKeys).toHaveLength(0);
});

test('passing an initial selection sets selectedKeys correctly', () => {
    const myProps = {
        ...props,
        initialSelection: [{ name: 'first' }]
    };

    createTestInstance(<Component listStateProps={myProps} />);

    const [state] = log.mock.calls[0][0];
    const { selectedKeys } = state;

    expect(selectedKeys).toHaveLength(1);
});

test('radio lists can only have one initially selected key', () => {
    const myProps = {
        ...props,
        initialSelection: [{ name: 'first' }, { name: 'second' }]
    };

    createTestInstance(<Component listStateProps={myProps} />);

    const [state] = log.mock.calls[0][0];
    const { selectedKeys } = state;

    expect(selectedKeys).toHaveLength(1);
});

test('checkbox lists can have multiple initially selected keys', () => {
    const myProps = {
        ...props,
        initialSelection: [{ name: 'first' }, { name: 'second' }],
        selectionModel: 'checkbox'
    };

    createTestInstance(<Component listStateProps={myProps} />);

    const [state] = log.mock.calls[0][0];
    const { selectedKeys } = state;

    expect(selectedKeys).toHaveLength(2);
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

test('updateSelectedKeys should replace the selected ID inside selection state when selectionModel is radio', () => {
    const props = {
        selectionModel: 'radio',
        onSelectionChange: jest.fn()
    };
    createTestInstance(<Component listStateProps={props} />);
    let [state, api] = log.mock.calls[0][0];

    api.updateSelectedKeys('001');
    [state, api] = log.mock.calls[1][0];

    expect(state.selectedKeys.has('001')).toBeTruthy();

    api.updateSelectedKeys('002');
    [state, api] = log.mock.calls[2][0];

    expect(state.selectedKeys.has('001')).not.toBeTruthy();
    expect(state.selectedKeys.has('002')).toBeTruthy();
});

test('updateSelectedKeys should add the new ID into selection state when selectionModel is checkbox', () => {
    const props = { selectionModel: 'checkbox', onSelectionChange: jest.fn() };
    createTestInstance(<Component listStateProps={props} />);
    let [state, api] = log.mock.calls[0][0];

    api.updateSelectedKeys('001');
    [state, api] = log.mock.calls[1][0];

    expect(state.selectedKeys.has('001')).toBeTruthy();

    api.updateSelectedKeys('002');
    [state, api] = log.mock.calls[2][0];

    expect(state.selectedKeys.has('001')).toBeTruthy();
    expect(state.selectedKeys.has('002')).toBeTruthy();
});

test('onSelectionChange should be triggered when selection state changes', () => {
    const onSelectionChange = jest.fn();
    const props = { selectionModel: 'radio', onSelectionChange };
    createTestInstance(<Component listStateProps={props} />);

    expect(onSelectionChange).toHaveBeenNthCalledWith(1, new Set());

    const [, api] = log.mock.calls[0][0];
    act(() => {
        api.updateSelectedKeys('001');
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

    api.updateSelectedKeys('001');
    [state, api] = log.mock.calls[1][0];

    expect(state.selectedKeys.has('001')).toBeTruthy();

    api.updateSelectedKeys('001');
    [state, api] = log.mock.calls[2][0];

    expect(state.selectedKeys.has('001')).not.toBeTruthy();
});

test('ID selection should not have toggling behavior when selectionModel is radio', () => {
    const props = { selectionModel: 'radio', onSelectionChange: jest.fn() };
    createTestInstance(<Component listStateProps={props} />);
    let [state, api] = log.mock.calls[0][0];

    api.updateSelectedKeys('001');
    [state, api] = log.mock.calls[1][0];

    expect(state.selectedKeys.has('001')).toBeTruthy();

    api.updateSelectedKeys('001');
    [state, api] = log.mock.calls[2][0];

    expect(state.selectedKeys.has('001')).toBeTruthy();
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

test('updateSelectedKeys should get new reference if selectionModel argument changes', () => {
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

    expect(log.mock.calls[1][0][1].updateSelectedKeys).not.toBe(
        log.mock.calls[0][0][1].updateSelectedKeys
    );
});

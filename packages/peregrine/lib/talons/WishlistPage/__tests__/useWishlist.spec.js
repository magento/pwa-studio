import React from 'react';
import { act } from 'react-test-renderer';

import createTestInstance from '../../../util/createTestInstance';
import { useWishlist } from '../useWishlist';

jest.mock('@apollo/client', () => {
    return {
        ...jest.requireActual('@apollo/client'),
        useMutation: jest.fn(() => [
            jest.fn(),
            {
                error: false,
                loading: false
            }
        ])
    };
});

const Component = props => {
    const talonProps = useWishlist({ ...props });

    return <i talonProps={talonProps} />;
};

const baseProps = {
    id: '5',
    mutations: { updateWishlistMutation: 'updateWishlistMutation' }
};

test('returns correct shape', () => {
    const { root } = createTestInstance(<Component {...baseProps} />);
    const { talonProps } = root.findByType('i').props;

    expect(talonProps).toMatchSnapshot();
});

test('toggles open state', () => {
    const talonPropsResult = [];

    const { root } = createTestInstance(<Component />);
    talonPropsResult.push(root.findByType('i').props.talonProps);

    act(() => {
        talonPropsResult[0].handleContentToggle();
    });

    talonPropsResult.push(root.findByType('i').props.talonProps);

    act(() => {
        talonPropsResult[1].handleContentToggle();
    });

    talonPropsResult.push(root.findByType('i').props.talonProps);

    expect(talonPropsResult[0].isOpen).toBe(true);
    expect(talonPropsResult[1].isOpen).toBe(false);
    expect(talonPropsResult[2].isOpen).toBe(true);
});

test('it handles opening list actions dialog', () => {
    const talonPropsResult = [];

    const { root } = createTestInstance(<Component />);
    talonPropsResult.push(root.findByType('i').props.talonProps);

    act(() => {
        talonPropsResult[0].handleActionMenuClick();
    });

    talonPropsResult.push(root.findByType('i').props.talonProps);

    expect(talonPropsResult[0].editFavoritesListIsOpen).toBe(false);
    expect(talonPropsResult[0].listActionsIsOpen).toBe(false);
    expect(talonPropsResult[1].editFavoritesListIsOpen).toBe(false);
    expect(talonPropsResult[1].listActionsIsOpen).toBe(true);
});

test('it handles hiding dialog', () => {
    const talonPropsResult = [];

    const { root } = createTestInstance(<Component />);
    talonPropsResult.push(root.findByType('i').props.talonProps);

    act(() => {
        talonPropsResult[0].handleHideDialogs();
    });

    talonPropsResult.push(root.findByType('i').props.talonProps);

    expect(talonPropsResult[0].editFavoritesListIsOpen).toBe(false);
    expect(talonPropsResult[0].listActionsIsOpen).toBe(false);
    expect(talonPropsResult[1].editFavoritesListIsOpen).toBe(false);
    expect(talonPropsResult[1].listActionsIsOpen).toBe(false);
});

test('it handles showing edit favorites dialog', () => {
    const talonPropsResult = [];

    const { root } = createTestInstance(<Component />);
    talonPropsResult.push(root.findByType('i').props.talonProps);

    act(() => {
        talonPropsResult[0].handleShowEditFavorites();
    });

    talonPropsResult.push(root.findByType('i').props.talonProps);

    expect(talonPropsResult[0].editFavoritesListIsOpen).toBe(false);
    expect(talonPropsResult[0].listActionsIsOpen).toBe(false);
    expect(talonPropsResult[1].editFavoritesListIsOpen).toBe(true);
    expect(talonPropsResult[1].listActionsIsOpen).toBe(false);
});

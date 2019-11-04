import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import Pagination from '../pagination';

jest.mock('../../../classify');
jest.mock('../navButton', () => () => <i />);
jest.mock('../tile', () => () => <i />);

jest.mock('@magento/peregrine/lib/talons/Pagination/usePagination', () => {
    const handleLeftSkip = jest.fn();
    const handleRightSkip = jest.fn();
    const handleNavBack = jest.fn();
    const handleNavForward = jest.fn();
    const isActiveLeft = false;
    const isActiveRight = false;
    const tiles = [1, 2];

    const usePagination = jest.fn(() => ({
        handleLeftSkip,
        handleRightSkip,
        handleNavBack,
        handleNavForward,
        isActiveLeft,
        isActiveRight,
        tiles
    }));

    return { usePagination };
});

const pageControl = {
    currentPage: 1,
    setPage: jest.fn(),
    totalPages: 2
};

test('renders correctly', () => {
    const component = createTestInstance(
        <Pagination pageControl={pageControl} />
    );

    expect(component.toJSON()).toMatchSnapshot();
});

test('renders nothing if totalPages is 1', () => {
    const onePage = { ...pageControl, totalPages: 1 };
    const component = createTestInstance(<Pagination pageControl={onePage} />);

    expect(component.toJSON()).toMatchSnapshot();
});

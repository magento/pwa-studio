import React from 'react';
import { act } from 'react-test-renderer';
import { createTestInstance, usePagination } from '@magento/peregrine';

import { navButtons } from '../constants';
import Pagination from '../pagination';

jest.mock('../../../classify');
jest.mock('../navButton');

const PaginationWrapper = ({ currentPage = 1, totalPages = 3 }) => {
    const [paginationValues, paginationApi] = usePagination({
        initialPage: currentPage,
        initialTotalPages: totalPages
    });

    const pageControl = {
        currentPage: paginationValues.currentPage || currentPage,
        setPage: jest.spyOn(paginationApi, 'setCurrentPage'),
        updateTotalPages: jest.spyOn(paginationApi, 'setTotalPages'),
        totalPages: paginationValues.totalPages || totalPages
    };

    const classes = {
        root: 'root'
    };

    return <Pagination pageControl={pageControl} classes={classes} />;
};

test('renders when there is more than 1 page', () => {
    const instance = createTestInstance(<PaginationWrapper />);

    expect(instance.toJSON()).toMatchSnapshot();
    expect(instance.root.findByProps({ className: 'root' })).toBeTruthy();
});

test('renders nothing when there is only 1 page', () => {
    const instance = createTestInstance(<PaginationWrapper totalPages={1} />);

    expect(instance.toJSON()).toMatchSnapshot();
    expect(instance.root.findAllByProps({ className: 'root' })).toHaveLength(0);
});

test('tiles set the appropriate page number on click', () => {
    const { root } = createTestInstance(<PaginationWrapper />);

    const button = root.findAllByType('button')[2];

    act(() => {
        button.props.onClick();
    });

    const setPageSpy = root.findByType(Pagination).props.pageControl.setPage;
    expect(setPageSpy).toHaveBeenCalledTimes(1);
    expect(setPageSpy).toHaveBeenCalledWith(3);
});

test('prevPage button decrements page by 1', () => {
    const { root } = createTestInstance(<PaginationWrapper currentPage={2} />);

    const prevPage = root.findByProps({ name: navButtons.prevPage.name });
    act(() => {
        prevPage.props.onClick();
    });

    const setPageSpy = root.findByType(Pagination).props.pageControl.setPage;
    expect(setPageSpy).toHaveBeenCalledTimes(1);
    expect(setPageSpy).toHaveBeenLastCalledWith(1);
});

test('prevPage button does nothing if currentPage is 1', () => {
    const { root } = createTestInstance(<PaginationWrapper />);

    const prevPage = root.findByProps({ name: navButtons.prevPage.name });

    act(() => {
        prevPage.props.onClick();
    });

    const setPageSpy = root.findByType(Pagination).props.pageControl.setPage;
    expect(setPageSpy).not.toHaveBeenCalled();
});

test('nextPage button increments page by 1', () => {
    const { root } = createTestInstance(<PaginationWrapper />);

    const nextPage = root.findByProps({ name: navButtons.nextPage.name });

    act(() => {
        nextPage.props.onClick();
    });

    const setPageSpy = root.findByType(Pagination).props.pageControl.setPage;
    expect(setPageSpy).toHaveBeenCalledTimes(1);
    expect(setPageSpy).toHaveBeenLastCalledWith(2);
});

test('nextPage button does nothing on last page', () => {
    const { root } = createTestInstance(<PaginationWrapper currentPage={3} />);

    const nextPage = root.findByProps({ name: navButtons.nextPage.name });

    act(() => {
        nextPage.props.onClick();
    });

    const setPageSpy = root.findByType(Pagination).props.pageControl.setPage;
    expect(setPageSpy).not.toHaveBeenCalled();
});

test('leftSkip skips toward first page', () => {
    const { root } = createTestInstance(
        <PaginationWrapper currentPage={8} totalPages={10} />
    );

    const firstPage = root.findByProps({ name: navButtons.firstPage.name });

    act(() => {
        firstPage.props.onClick();
    });

    const setPageSpy = root.findByType(Pagination).props.pageControl.setPage;
    expect(setPageSpy).toHaveBeenCalledTimes(1);
    expect(setPageSpy).toHaveBeenLastCalledWith(3);
});

test('rightSkip skips toward last page', () => {
    const { root } = createTestInstance(<PaginationWrapper />);

    const lastPage = root.findByProps({ name: navButtons.lastPage.name });
    const setPageSpy = root.findByType(Pagination).props.pageControl.setPage;

    act(() => {
        lastPage.props.onClick();
    });

    expect(setPageSpy).toHaveBeenCalledTimes(1);
    expect(setPageSpy).toHaveBeenLastCalledWith(3);
});

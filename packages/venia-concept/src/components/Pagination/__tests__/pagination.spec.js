import React from 'react';
import { act } from 'react-test-renderer';
import { MemoryRouter } from 'react-router-dom';
import { createTestInstance, usePagination } from '@magento/peregrine';

import { navButtons } from '../constants';
import NavButton from '../navButton';
import Pagination from '../pagination';

jest.mock('src/classify');
jest.mock('../navButton');
void NavButton;

const PaginationWrapper = ({ currentPage = 1, totalPages = 3 }) => {
    const [paginationValues, paginationApi] = usePagination(currentPage);

    const pageControl = {
        currentPage: paginationValues.currentPage || currentPage,
        setPage: jest.spyOn(paginationApi, 'setCurrentPage'),
        updateTotalPages: jest.spyOn(paginationApi, 'setTotalPages'),
        totalPages: paginationValues.totalPages || totalPages
    };
    return <Pagination pageControl={pageControl} />;
};

test('renders when there is more than 1 page', () => {
    const { root } = createTestInstance(
        <MemoryRouter>
            <PaginationWrapper />
        </MemoryRouter>
    );

    expect(root.findByProps({ className: 'root' })).toBeTruthy();
});

test('renders nothing when there is only 1 page', () => {
    const { root } = createTestInstance(
        <MemoryRouter>
            <PaginationWrapper totalPages={1} />
        </MemoryRouter>
    );

    expect(root.findAllByProps({ className: 'root' })).toHaveLength(0);
});

test('tiles set the appropriate page number on click', () => {
    const { root } = createTestInstance(
        <MemoryRouter>
            <PaginationWrapper />
        </MemoryRouter>
    );

    const tile = root.findAllByProps({ className: 'tileButton' })[2];

    act(() => {
        tile.props.onClick();
    });

    const setPageSpy = root.findByType(Pagination).props.pageControl.setPage;
    expect(setPageSpy).toHaveBeenCalledTimes(1);
    expect(setPageSpy).toHaveBeenLastCalledWith(3);
});

test('sets the current page based on the query param', async () => {
    const { root } = createTestInstance(
        <MemoryRouter
            initialEntries={[{ pathname: '/index.html', search: '?page=2' }]}
            initialIndex={0}
        >
            <PaginationWrapper />
        </MemoryRouter>
    );

    const setPageSpy = root.findByType(Pagination).props.pageControl.setPage;
    expect(setPageSpy).toHaveBeenCalledTimes(1);
    expect(setPageSpy).toHaveBeenLastCalledWith(2);
});

test('prevPage button decrements page by 1', () => {
    const { root } = createTestInstance(
        <MemoryRouter
            initialEntries={[{ pathname: '/index.html', search: '?page=2' }]}
            initialIndex={0}
        >
            <PaginationWrapper currentPage={2} />
        </MemoryRouter>
    );

    const prevPage = root.findByProps({ name: navButtons.prevPage.name });
    act(() => {
        prevPage.props.onClick();
    });

    const setPageSpy = root.findByType(Pagination).props.pageControl.setPage;
    expect(setPageSpy).toHaveBeenCalledTimes(1);
    expect(setPageSpy).toHaveBeenLastCalledWith(1);
});

test('prevPage button does nothing if currentPage is 1', () => {
    const { root } = createTestInstance(
        <MemoryRouter>
            <PaginationWrapper />
        </MemoryRouter>
    );

    const prevPage = root.findByProps({ name: navButtons.prevPage.name });

    act(() => {
        prevPage.props.onClick();
    });

    const setPageSpy = root.findByType(Pagination).props.pageControl.setPage;
    expect(setPageSpy).not.toHaveBeenCalled();
});

test('nextPage button increments page by 1', () => {
    const { root } = createTestInstance(
        <MemoryRouter>
            <PaginationWrapper />
        </MemoryRouter>
    );

    const nextPage = root.findByProps({ name: navButtons.nextPage.name });

    act(() => {
        nextPage.props.onClick();
    });

    const setPageSpy = root.findByType(Pagination).props.pageControl.setPage;
    expect(setPageSpy).toHaveBeenCalledTimes(1);
    expect(setPageSpy).toHaveBeenLastCalledWith(2);
});

test('nextPage button does nothing on last page', () => {
    const { root } = createTestInstance(
        <MemoryRouter
            initialEntries={[{ pathname: '/index.html', search: '?page=3' }]}
            initialIndex={0}
        >
            <PaginationWrapper currentPage={3} />
        </MemoryRouter>
    );

    const nextPage = root.findByProps({ name: navButtons.nextPage.name });

    act(() => {
        nextPage.props.onClick();
    });

    const setPageSpy = root.findByType(Pagination).props.pageControl.setPage;
    expect(setPageSpy).not.toHaveBeenCalled();
});

test('leftSkip skips toward first page', () => {
    const { root } = createTestInstance(
        <MemoryRouter
            initialEntries={[{ pathname: '/index.html', search: '?page=8' }]}
            initialIndex={0}
        >
            <PaginationWrapper currentPage={8} totalPages={10} />
        </MemoryRouter>
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
    const { root } = createTestInstance(
        <MemoryRouter>
            <PaginationWrapper />
        </MemoryRouter>
    );

    const lastPage = root.findByProps({ name: navButtons.lastPage.name });
    const setPageSpy = root.findByType(Pagination).props.pageControl.setPage;

    act(() => {
        lastPage.props.onClick();
    });

    expect(setPageSpy).toHaveBeenCalledTimes(1);
    expect(setPageSpy).toHaveBeenLastCalledWith(3);
});

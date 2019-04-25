import React from 'react';
import TestRenderer from 'react-test-renderer';
import { MemoryRouter } from 'react-router-dom';

import { navButtons } from '../constants';
import NavButton from '../navButton';
import Pagination from '../pagination';

jest.mock('src/classify');
jest.mock('../navButton');

const setPage = jest.fn();
const updateTotalPages = jest.fn();
void NavButton;

const defaultPageControl = {
    currentPage: 1,
    setPage,
    totalPages: 3,
    updateTotalPages
};

test('renders when there is more than 1 page', () => {
    const { root } = TestRenderer.create(
        <MemoryRouter>
            <Pagination pageControl={defaultPageControl} />
        </MemoryRouter>
    );

    expect(root.findByProps({ className: 'root' })).toBeTruthy();
});

test('renders nothing when there is only 1 page', () => {
    const pageControl = { ...defaultPageControl, totalPages: 1 };
    const { root } = TestRenderer.create(
        <MemoryRouter>
            <Pagination pageControl={pageControl} />
        </MemoryRouter>
    );

    expect(root.findAllByProps({ className: 'root' })).toHaveLength(0);
});

test('tiles set the appropriate page number on click', () => {
    const pageControl = { ...defaultPageControl };
    const { root } = TestRenderer.create(
        <MemoryRouter>
            <Pagination pageControl={pageControl} />
        </MemoryRouter>
    );

    const tile = root.findAllByProps({ className: 'tileButton' })[2];

    tile.props.onClick();

    expect(setPage).toHaveBeenCalledTimes(1);
    expect(setPage).toHaveBeenLastCalledWith(3);
});

test('sets the current page based on the query param', async () => {
    const pageControl = { ...defaultPageControl };

    TestRenderer.create(
        <MemoryRouter
            initialEntries={[{ pathname: '/index.html', search: '?page=2' }]}
            initialIndex={0}
        >
            <Pagination pageControl={pageControl} />
        </MemoryRouter>
    );

    expect(setPage).toHaveBeenCalledTimes(1);
    expect(setPage).toHaveBeenLastCalledWith(2);
});

test('prevPage button decrements page by 1', () => {
    const pageControl = { ...defaultPageControl, currentPage: 2 };
    const { root } = TestRenderer.create(
        <MemoryRouter
            initialEntries={[{ pathname: '/index.html', search: '?page=2' }]}
            initialIndex={0}
        >
            <Pagination pageControl={pageControl} />
        </MemoryRouter>
    );

    const prevPage = root.findByProps({ name: navButtons.prevPage.name });

    prevPage.props.onClick();

    expect(setPage).toHaveBeenCalledTimes(1);
    expect(setPage).toHaveBeenLastCalledWith(1);
});

test('prevPage button does nothing if currentPage is 1', () => {
    const pageControl = { ...defaultPageControl };
    const { root } = TestRenderer.create(
        <MemoryRouter>
            <Pagination pageControl={pageControl} />
        </MemoryRouter>
    );

    const prevPage = root.findByProps({ name: navButtons.prevPage.name });

    prevPage.props.onClick();

    expect(setPage).not.toHaveBeenCalled();
});

test('nextPage button increments page by 1', () => {
    const pageControl = { ...defaultPageControl };
    const { root } = TestRenderer.create(
        <MemoryRouter>
            <Pagination pageControl={pageControl} />
        </MemoryRouter>
    );

    const nextPage = root.findByProps({ name: navButtons.nextPage.name });

    nextPage.props.onClick();

    expect(setPage).toHaveBeenCalledTimes(1);
    expect(setPage).toHaveBeenLastCalledWith(2);
});

test('nextPage button does nothing on last page', () => {
    const pageControl = { ...defaultPageControl, currentPage: 3 };
    const { root } = TestRenderer.create(
        <MemoryRouter
            initialEntries={[{ pathname: '/index.html', search: '?page=3' }]}
            initialIndex={0}
        >
            <Pagination pageControl={pageControl} />
        </MemoryRouter>
    );

    const nextPage = root.findByProps({ name: navButtons.nextPage.name });

    nextPage.props.onClick();

    expect(setPage).not.toHaveBeenCalled();
});

test('leftSkip skips toward first page', () => {
    const pageControl = {
        ...defaultPageControl,
        currentPage: 8,
        totalPages: 10
    };

    const { root } = TestRenderer.create(
        <MemoryRouter
            initialEntries={[{ pathname: '/index.html', search: '?page=8' }]}
            initialIndex={0}
        >
            <Pagination pageControl={pageControl} />
        </MemoryRouter>
    );

    const firstPage = root.findByProps({ name: navButtons.firstPage.name });

    firstPage.props.onClick();

    expect(setPage).toHaveBeenCalledTimes(1);
    expect(setPage).toHaveBeenLastCalledWith(3);
});

test('rightSkip skips toward last page', () => {
    const pageControl = {
        ...defaultPageControl,
        currentPage: 1,
        totalPages: 10
    };

    const { root } = TestRenderer.create(
        <MemoryRouter>
            <Pagination pageControl={pageControl} />
        </MemoryRouter>
    );

    const lastPage = root.findByProps({ name: navButtons.lastPage.name });

    lastPage.props.onClick();

    expect(setPage).toHaveBeenCalledTimes(1);
    expect(setPage).toHaveBeenLastCalledWith(8);
});

test('updateTotalPages is called on component mount', () => {
    TestRenderer.create(
        <MemoryRouter>
            <Pagination pageControl={defaultPageControl} />
        </MemoryRouter>
    );

    expect(updateTotalPages).toHaveBeenCalledTimes(1);
});

import React from 'react';
import { shallow, mount } from 'enzyme';

import Pagination from '../pagination';

const classes = { root: 'a' };

const defaultPageControl = {
    currentPage: 1,
    setPage: () => {},
    updateTotalPages: () => {},
    totalPages: 3
};

test('Pagination component renders when there is more than 1 page', () => {
    const wrapper = shallow(
        <Pagination classes={classes} pageControl={defaultPageControl} />
    ).dive();
    expect(wrapper.hasClass(classes.root)).toBe(true);
});

test('Pagination component does not render when there is only 1 page', () => {
    const pageControl = { ...defaultPageControl, totalPages: 1 };
    const wrapper = shallow(
        <Pagination classes={classes} pageControl={pageControl} />
    ).dive();
    expect(wrapper.hasClass(classes.root)).toBe(false);
});

test('clicking a numbered tile returns the appropriate page number', () => {
    let pageTracker;
    const setPage = pageNumber => {
        pageTracker = pageNumber;
    };

    const pageControl = { ...defaultPageControl, setPage: setPage };
    const wrapper = shallow(<Pagination pageControl={pageControl} />).dive();

    const tile3 = wrapper.find('button').at(2);
    tile3.simulate('click');
    expect(pageTracker).toEqual(3);
});

test('left arrow navigation', () => {
    const startingPage = 3;
    let pageTracker = startingPage;
    const setPage = pageNumber => {
        pageTracker = pageNumber;
    };

    const pageControl = {
        ...defaultPageControl,
        currentPage: startingPage,
        setPage: setPage
    };
    const wrapper = mount(<Pagination pageControl={pageControl} />);

    const leftArrowNav = wrapper.find('button').at(1);
    // Page 3 -> 2
    expect(pageTracker).toEqual(startingPage);
    leftArrowNav.simulate('click');
    expect(pageTracker).toEqual(startingPage - 1);
});

test('right arrow navigation', () => {
    const startingPage = 2;
    let pageTracker = startingPage;
    const setPage = pageNumber => {
        pageTracker = pageNumber;
    };
    const pageControl = {
        ...defaultPageControl,
        currentPage: startingPage,
        setPage: setPage
    };
    const wrapper = mount(<Pagination pageControl={pageControl} />);

    const rightArrowNav = wrapper.find('button').at(5);
    // Page 2 -> 3
    expect(pageTracker).toEqual(startingPage);
    rightArrowNav.simulate('click');
    expect(pageTracker).toEqual(startingPage + 1);
});

test('left bound prevents the lead tile from falling below 1', () => {
    const currentPage = 2;
    const totalPages = 8;
    const wrapper = shallow(
        <Pagination pageControl={defaultPageControl} />
    ).dive();
    const leadTile = wrapper.instance().getLeadTile;
    expect(leadTile(currentPage, totalPages)).toEqual(1);
});

test('right bound prevents the lead tile from exceeding total pages - visible tile buffer', () => {
    const currentPage = 7;
    const totalPages = 9;
    const wrapper = shallow(
        <Pagination pageControl={defaultPageControl} />
    ).dive();
    const leadTile = wrapper.instance().getLeadTile;
    expect(leadTile(currentPage, totalPages)).toEqual(5);
});

test('left skip', () => {
    const startingPage = 8;
    const totalPages = 10;
    let pageTracker = startingPage;
    const setPage = pageNumber => {
        pageTracker = pageNumber;
    };
    const pageControl = {
        ...defaultPageControl,
        currentPage: startingPage,
        setPage: setPage,
        totalPages: totalPages
    };
    const wrapper = mount(<Pagination pageControl={pageControl} />);

    const leftSkipButton = wrapper.find('button').first();
    leftSkipButton.simulate('click');
    expect(pageTracker).toEqual(3);
});

test('right skip', () => {
    const startingPage = 1;
    const totalPages = 10;
    let pageTracker = startingPage;
    const setPage = pageNumber => {
        pageTracker = pageNumber;
    };
    const pageControl = {
        ...defaultPageControl,
        currentPage: startingPage,
        setPage: setPage,
        totalPages: totalPages
    };
    const wrapper = mount(<Pagination pageControl={pageControl} />);

    const rightSkipButton = wrapper.find('button').last();
    rightSkipButton.simulate('click');
    expect(pageTracker).toEqual(8);
});

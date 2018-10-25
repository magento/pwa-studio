import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Pagination from '../pagination';

configure({ adapter: new Adapter() });

const classes = { root: 'a' };

let mockPageControl = {};

const defaultPageControl = {
    currentPage: 1,
    setPage: () => {},
    updateTotalPages: () => {},
    totalPages: 3
};

afterEach(() => {
    mockPageControl = Object.assign({}, defaultPageControl);
});

test('Pagination component renders when there is more than 1 page', () => {
    const wrapper = shallow(
        <Pagination classes={classes} pageControl={defaultPageControl} />
    ).dive();
    expect(wrapper.hasClass(classes.root)).toBe(true);
});

test('Pagination component does not render when there is only 1 page', () => {
    const pageControl = Object.assign(mockPageControl, { totalPages: 1 });
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

    const pageControl = Object.assign(mockPageControl, { setPage: setPage });
    const wrapper = shallow(<Pagination pageControl={pageControl} />).dive();

    const tile3 = wrapper.find('button').at(3);
    tile3.simulate('click');
    expect(pageTracker).toEqual(3);
});

test('left arrow navigation', () => {
    const startingPage = 3;
    let pageTracker = startingPage;
    const setPage = pageNumber => {
        pageTracker = pageNumber;
    };

    const pageControl = Object.assign(mockPageControl, {
        currentPage: startingPage,
        setPage: setPage
    });
    const wrapper = shallow(<Pagination pageControl={pageControl} />).dive();

    const leftArrowNav = wrapper.find('button').first();
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

    const pageControl = Object.assign(mockPageControl, {
        currentPage: startingPage,
        setPage: setPage
    });
    const wrapper = shallow(<Pagination pageControl={pageControl} />).dive();

    const rightArrowNav = wrapper.find('button').last();
    // Page 2 -> 3
    expect(pageTracker).toEqual(startingPage);
    rightArrowNav.simulate('click');
    expect(pageTracker).toEqual(startingPage + 1);
});

test('left bound prevents the lead tile from falling below 1', () => {
    const currentPage = 3;
    const totalPages = 8;
    const pageControl = Object.assign(mockPageControl, {
        currentPage: currentPage,
        totalPages: totalPages
    });
    const wrapper = shallow(<Pagination pageControl={pageControl} />).dive();
    const leadTile = wrapper.instance().getLeadTile;
    expect(leadTile()).toEqual(1);
});

test('right bound prevents the lead tile from exceeding total pages - visible tile buffer', () => {
    const currentPage = 7;
    const totalPages = 9;
    const pageControl = Object.assign(mockPageControl, {
        currentPage: currentPage,
        totalPages: totalPages
    });
    const wrapper = shallow(<Pagination pageControl={pageControl} />).dive();
    const leadTile = wrapper.instance().getLeadTile;
    expect(leadTile()).toEqual(3);
});

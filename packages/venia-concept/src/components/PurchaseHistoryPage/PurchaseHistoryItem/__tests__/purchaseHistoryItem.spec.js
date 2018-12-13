import React from 'react';
import { shallow } from 'enzyme';

import PurchaseHistoryItem from '../purchaseHistoryItem';
import { processDate } from '../helpers';

const classes = {
    body: 'body',
    image: 'image',
    textBlock: 'textBlock',
    textBlockTitle: 'textBlockTitle',
    textBlockDate: 'textBlockDate',
    chevronContainer: 'chevronContainer'
};

const item = {
    id: 1,
    imageSrc: 'image.jpg',
    title: 'Lorem ipsum dolor sit amet',
    date: Date.now(),
    url: '/'
};

test('renders correctly', () => {
    const wrapper = shallow(
        <PurchaseHistoryItem classes={classes} item={item} />
    ).dive();

    expect(wrapper.find(`.${classes.textBlockTitle}`).text()).toBe(item.title);
    expect(wrapper.find(`.${classes.image}`).prop('src')).toBe(item.imageSrc);
    expect(wrapper.find(`.${classes.textBlockDate}`).text()).toBe(
        processDate(item.date)
    );
});

test('contains link to item page', () => {
    const wrapper = shallow(
        <PurchaseHistoryItem classes={classes} item={item} />
    ).dive();

    expect(wrapper.find(`.${classes.body}`).prop('to')).toBe(item.url);
});

import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import CategoryContent from '../categoryContent';

configure({ adapter: new Adapter() });

const classes = {
    root: 'a',
    title: 'b',
    gallery: 'c',
    pagination: 'd'
};

const data = {
    category: {
        products: {
            items: {
                id: 1
            }
        },
        description: 'test'
    }
};

test('renders with props', () => {
    const pageSize = 6;
    const wrapper = shallow(
        <CategoryContent
            pageControl={{}}
            data={data}
            pageSize={pageSize}
            classes={classes}
        />
    ).dive();

    expect(wrapper.hasClass(classes.root)).toBe(true);
});

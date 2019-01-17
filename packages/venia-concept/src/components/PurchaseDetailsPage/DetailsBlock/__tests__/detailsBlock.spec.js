import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import DetailsBlock from '../detailsBlock';

configure({ adapter: new Adapter() });

const classes = {
    property: 'property',
    value: 'value'
};

const rows = [
    { property: 'Order No', value: '84322' },
    { property: 'Order Date', value: 'June 24, 2018' }
];

test('renders correctly', () => {
    const wrapper = shallow(
        <DetailsBlock classes={classes} rows={rows} />
    ).dive();

    expect(wrapper.find(`.${classes.property}`)).toHaveLength(rows.length);
    expect(wrapper.find(`.${classes.value}`)).toHaveLength(rows.length);

    wrapper.find(`.${classes.property}`).forEach((node, index) => {
        expect(node.text()).toEqual(rows[index].property);
    });

    wrapper.find(`.${classes.value}`).forEach((node, index) => {
        expect(node.text()).toEqual(rows[index].value);
    });
});

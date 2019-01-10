import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import OrderItem from '../orderItem';
import ButtonGroup from '../ButtonGroup';

configure({ adapter: new Adapter() });

const itemMock = {
    id: 1,
    name: 'name',
    size: '43',
    color: 'color',
    qty: 1,
    titleImageSrc: 'picturePath',
    price: 10,
    sku: '24-MB01'
};

const classes = {
    main: 'main',
    imageAndPropsContainer: 'imageAndPropsContainer',
    titleImage: 'titleImage',
    propsColumnContainer: 'propsColumnContainer',
    priceContainer: 'priceContainer'
};

test('renders correctly', () => {
    const onBuyAgainMock = jest.fn();
    const onShareMock = jest.fn();

    const wrapper = shallow(
        <OrderItem
            classes={classes}
            item={itemMock}
            onBuyAgain={onBuyAgainMock}
            onShare={onShareMock}
        />
    ).dive();

    expect(wrapper.find(`.${classes.main}`)).toHaveLength(1);
    expect(wrapper.find(`.${classes.imageAndPropsContainer}`)).toHaveLength(1);
    expect(wrapper.find(`.${classes.titleImage}`)).toHaveLength(1);
    expect(wrapper.find(`.${classes.propsColumnContainer}`)).toHaveLength(1);
    expect(wrapper.find(`.${classes.priceContainer}`)).toHaveLength(1);
    expect(wrapper.find(ButtonGroup)).toHaveLength(1);
});

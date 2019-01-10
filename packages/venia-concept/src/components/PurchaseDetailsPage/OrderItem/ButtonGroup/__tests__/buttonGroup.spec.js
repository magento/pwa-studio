import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import ButtonGroup from '../buttonGroup';
import Button from 'src/components/Button';

configure({ adapter: new Adapter() });

const classes = {
    buttonGroupItem: 'buttonGroupItem',
    textNodeContainer: 'textNodeContainer'
};

const buttonGroupItemsMock = [
    {
        onClickHandler: jest.fn(),
        iconName: 'icon1',
        textNode: 'text1'
    },
    {
        onClickHandler: jest.fn(),
        iconName: 'icon2',
        textNode: 'text2'
    }
];

afterEach(() => {
    buttonGroupItemsMock.forEach(button => button.onClickHandler.mockReset());
});

test('renders all button group items correctly', () => {
    const wrapper = shallow(
        <ButtonGroup buttonGroupItems={buttonGroupItemsMock} />
    ).dive();

    expect(wrapper.find(Button)).toHaveLength(buttonGroupItemsMock.length);
});

test('clicking buttons triggers appropriate handlers', () => {
    const wrapper = shallow(
        <ButtonGroup
            classes={classes}
            buttonGroupItems={buttonGroupItemsMock}
        />
    ).dive();

    wrapper.find(Button).forEach((buttonNode, index) => {
        const { onClickHandler } = buttonGroupItemsMock[index];
        buttonNode.simulate('click');
        expect(onClickHandler).toHaveBeenCalledTimes(1);
    });
});

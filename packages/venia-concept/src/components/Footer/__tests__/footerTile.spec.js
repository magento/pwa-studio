import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import FooterTile from '../footerTile';
import Icon from 'src/components/Icon';

configure({ adapter: new Adapter() });

const classes = {
    body: 'body'
};

// Any valid icon from feather icons package
const iconName = 'user';
const headerText = 'header text';
const headerTextClass = 'mockDiv';

const itemFirstCase = {
    iconName: iconName,
    headerTitle: headerText,
    bodyText: 'body text'
};

const itemSecondCase = {
    iconName: iconName,
    headerTitle: () => <div className={headerTextClass}>{headerText}</div>,
    bodyText: 'body text'
};

test('Renders correctly when headerTitle is a string', () => {
    const wrapper = shallow(
        <FooterTile classes={classes} item={itemFirstCase} />
    ).dive();
    expect(wrapper.find(Icon)).toHaveLength(1);
    expect(wrapper.find(`.${classes.body}`)).toHaveLength(1);
});

test('Renders correctly when headerTitle is a render prop', () => {
    const wrapper = shallow(
        <FooterTile classes={classes} item={itemSecondCase} />
    ).dive();
    expect(wrapper.find(Icon)).toHaveLength(1);
    expect(wrapper.find(`.${headerTextClass}`)).toHaveLength(1);
    expect(wrapper.find(`.${classes.body}`)).toHaveLength(1);
});

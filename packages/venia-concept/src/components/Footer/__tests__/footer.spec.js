import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Footer from '../footer';
import FooterTile from '../footerTile';

configure({ adapter: new Adapter() });

const classes = {
    copyright: 'copyright'
};

// Any valid icon from feather icons package
const iconName = 'user';

const footerTileItems = [
    {
        iconName: iconName,
        headerTitle: 'header text',
        bodyText: 'body text'
    },
    {
        iconName: iconName,
        headerTitle: 'header text',
        bodyText: 'body text'
    }
];

test('Renders correctly', () => {
    const wrapper = shallow(
        <Footer classes={classes} footerBlocksItems={footerTileItems} />
    ).dive();
    expect(wrapper.find(FooterTile)).toHaveLength(footerTileItems.length);
    expect(wrapper.find(`.${classes.copyright}`)).toHaveLength(1);
});

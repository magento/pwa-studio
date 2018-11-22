import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import MenuItem from '../menuItem';

configure({ adapter: new Adapter() });

const itemTitleClassName = 'title';
const itemRightNodeClassName = 'rightNode';

const itemTitle = <span className={itemTitleClassName} />;
const itemRightNode = <span className={itemRightNodeClassName} />;

test('renders correctly', () => {
    const item = {
        title: itemTitle,
        rightNode: itemRightNode
    };

    const wrapper = shallow(<MenuItem {...item} />).dive();

    expect(wrapper.find(`.${itemTitleClassName}`)).toHaveLength(1);
    expect(wrapper.find(`.${itemRightNodeClassName}`)).toHaveLength(1);
});

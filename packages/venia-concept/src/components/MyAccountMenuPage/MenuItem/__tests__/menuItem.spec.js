import React from 'react';
import { shallow } from 'enzyme';
import MenuItem from '../menuItem';

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

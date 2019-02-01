import React from 'react';
import { shallow } from 'enzyme';
import MenuItem from '../menuItem';

const itemTitleClassName = 'title';
const itemBadgeNodeClassName = 'badge';

const itemTitle = <span className={itemTitleClassName} />;
const itemBadge = <span className={itemBadgeNodeClassName} />;

test('renders correctly', () => {
    const item = {
        title: itemTitle,
        badge: itemBadge
    };

    const wrapper = shallow(<MenuItem {...item} />).dive();

    expect(wrapper.find(`.${itemTitleClassName}`)).toHaveLength(1);
    expect(wrapper.find(`.${itemBadgeNodeClassName}`)).toHaveLength(1);
});

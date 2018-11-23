import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Icon from 'src/components/Icon';
import UserInformation from '../userInformation';

configure({ adapter: new Adapter() });

const classes = {
    fullName: 'fullName',
    email: 'email',
    userInformationContainer: 'userInformationContainer',
    iconContainer: 'iconContainer',
    root: 'root'
};

const user = {
    fullname: 'Example User',
    email: 'user@example.com'
};

test('renders correctly', () => {
    const wrapper = shallow(
        <UserInformation user={user} classes={classes} />
    ).dive();

    expect(wrapper.find(Icon)).toHaveLength(1);
    expect(wrapper.find(`.${classes.fullName}`).text()).toBe(user.fullname);
    expect(wrapper.find(`.${classes.email}`).text()).toBe(user.email);
});

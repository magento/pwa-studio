import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import InformationBlock from '../../InformationBlock';

import Newsletter, {
    SUBSCRIBED_MESSAGE,
    NOT_SUBSCRIBED_MESSAGE,
    SUBSCRIBE_BUTTON_TEXT,
    UNSUBSCRIBE_BUTTON_TEXT
} from '../newsletter';

configure({ adapter: new Adapter() });

const classes = {
    subscriptionStatus: 'subscriptionStatus'
};

const user = {
    firstname: 'Veronica',
    lastname: 'Costello',
    email: 'roni_cost@example.com',
    extension_attributes: {
        is_subscribed: false
    }
};

test('renders correctly when user is not subscribed', () => {
    const wrapper = shallow(
        <Newsletter classes={classes} user={user} />
    ).dive();

    expect(wrapper.find(`.${classes.subscriptionStatus}`).text()).toBe(
        NOT_SUBSCRIBED_MESSAGE
    );
    expect(wrapper.find(InformationBlock).prop('actions')).toEqual([
        { title: SUBSCRIBE_BUTTON_TEXT }
    ]);
});

test('renders correctly when user is subscribed', () => {
    const user = {
        extension_attributes: {
            is_subscribed: true
        }
    };
    const wrapper = shallow(
        <Newsletter classes={classes} user={user} />
    ).dive();

    expect(wrapper.find(`.${classes.subscriptionStatus}`).text()).toBe(
        SUBSCRIBED_MESSAGE
    );
    expect(wrapper.find(InformationBlock).prop('actions')).toEqual([
        { title: UNSUBSCRIBE_BUTTON_TEXT }
    ]);
});

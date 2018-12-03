import React, { Component } from 'react';
import classify from 'src/classify';
import PropTypes from 'prop-types';
import InformationBlock from '../InformationBlock';
import Section from '../Section';
import { USER_PROP_TYPES } from '../constants';

export const SUBSCRIBED_MESSAGE = 'You are subscribed to our newsletter.';
export const NOT_SUBSCRIBED_MESSAGE =
    'You are not subscribed to our newsletter.';

export const SUBSCRIBE_BUTTON_TEXT = 'Subscribe';
export const UNSUBSCRIBE_BUTTON_TEXT = 'Unsubscribe';

class Newsletter extends Component {
    static propTypes = {
        user: PropTypes.shape(USER_PROP_TYPES),
        classes: PropTypes.shape({
            subscriptionStatus: PropTypes.string
        })
    };

    get isUserSubscribed() {
        const { user } = this.props;
        const { extension_attributes: { is_subscribed: isSubscribed } = {} } =
            user || {};

        return isSubscribed;
    }

    get subscriptionStatusText() {
        return this.isUserSubscribed
            ? SUBSCRIBED_MESSAGE
            : NOT_SUBSCRIBED_MESSAGE;
    }

    get actionButtonText() {
        return this.isUserSubscribed
            ? UNSUBSCRIBE_BUTTON_TEXT
            : SUBSCRIBE_BUTTON_TEXT;
    }

    render() {
        const { subscriptionStatusText, actionButtonText } = this;
        const { classes } = this.props;

        return (
            <Section title="Newsletter">
                <InformationBlock actions={[{ title: actionButtonText }]}>
                    <p className={classes.subscriptionStatus}>
                        {subscriptionStatusText}
                    </p>
                </InformationBlock>
            </Section>
        );
    }
}

export default classify()(Newsletter);

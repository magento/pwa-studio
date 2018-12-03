import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classify from 'src/classify';
import Section from '../Section';
import InformationBlock from '../InformationBlock';
import { USER_PROP_TYPES } from '../constants';

class ContactInformation extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            fullName: PropTypes.string,
            email: PropTypes.string,
            subscriptionStatus: PropTypes.string
        }),
        user: PropTypes.shape(USER_PROP_TYPES)
    };

    render() {
        const { user, classes } = this.props;
        const { firstname, lastname, email } = user || {};

        return (
            <Section title="Contact Information">
                <InformationBlock
                    actions={[{ title: 'Edit' }, { title: 'Change Password' }]}
                >
                    <div className={classes.fullName}>
                        {firstname} {lastname}
                    </div>
                    <div className={classes.email}>{email}</div>
                </InformationBlock>
            </Section>
        );
    }
}

export default classify()(ContactInformation);

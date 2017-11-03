import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default function makePWALink(Link) {
    return class PWALink extends Component {
        render() {
            const { entityType, entityID, to } = this.props;
            const location = {
                pathname: to,
                state: { entityType, entityID }
            };
            return <Link to={location}>{this.props.children}</Link>;
        }
    };
    PWALink.propTypes = {
        to: PropTypes.string.isRequired,
        entityID: PropTypes.number,
        entityType: PropTypes.string.isRequired
    };
}

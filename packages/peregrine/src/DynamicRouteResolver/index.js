import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default function makeDynamicRouteResolver(entityPageMap) {
    return class DynamicRouteResolver extends Component {
        render() {
            const { entityType, entityID } = this.props.location.state || {};
            if (!entityType || !(entityType in entityPageMap)) {
                const Page404 = entityPageMap['404'];
                return <Page404 />;
            }

            const PageComponent = entityPageMap[entityType];
            return (
                <PageComponent entityID={entityID} entityType={entityType} />
            );
        }
    };
    DynamicRouteResolver.propTypes = {
        entityID: PropTypes.number,
        entityType: PropTypes.string.isRequired
    };
}

import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import { Consumer, MagentoRouteHandler } from '../Router';

export default class Page extends Component {
    renderChildren(config) {
        return (
            <Route
                render={({ location }) => (
                    <MagentoRouteHandler {...config} location={location} />
                )}
            />
        );
    }

    render() {
        return <Consumer>{this.renderChildren}</Consumer>;
    }
}

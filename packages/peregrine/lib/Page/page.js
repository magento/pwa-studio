import React, { Component } from 'react';

import { MagentoRouteHandler, RouteConsumer } from '../Router';

export default class Page extends Component {
    render() {
        const { props } = this;

        return (
            <RouteConsumer>
                {context => <MagentoRouteHandler {...props} {...context} />}
            </RouteConsumer>
        );
    }
}

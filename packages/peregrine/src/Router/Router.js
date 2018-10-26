import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { string, func, object } from 'prop-types';
import MagentoRouteHandler from './MagentoRouteHandler';
import SearchRouteHandler from './SearchRouteHandler';

//import Search from '../../../venia-concept/src/RootComponents/Search';

export default class MagentoRouter extends Component {
    static propTypes = {
        /* Can be BrowserRouter, MemoryRouter, HashRouter, etc */
        using: func,
        routerProps: object,
        apiBase: string.isRequired,
        __tmp_webpack_public_path__: string.isRequired
    };

    static defaultProps = {
        using: BrowserRouter,
        routerProps: {}
    };

    render() {
        const {
            using: Router,
            routerProps,
            apiBase,
            __tmp_webpack_public_path__
        } = this.props;
				
        return (
            <Router {...routerProps}>
              <Switch>
                <Route
                  path="/search"
                  render={({ location }) => (
                    <SearchRouteHandler
                        location={location}
                        apiBase={apiBase}
                        __tmp_webpack_public_path__={
                            __tmp_webpack_public_path__
                        }
                    />
                  )}
                />
               <Route
                    render={({ location }) => (
                        <MagentoRouteHandler
                            location={location}
                            apiBase={apiBase}
                            __tmp_webpack_public_path__={
                                __tmp_webpack_public_path__
                            }
                        />
                    )}
                /> 
              </Switch>
            </Router>
        );
    }
}

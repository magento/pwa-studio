import { Component, createElement } from 'react';
import { Route, Switch } from 'react-router-dom';

import Home from 'src/view/Home';
import NotFound from 'src/view/NotFound';

import './main.css';

class Main extends Component {
    render() {
        return (
            <main className="Main">
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route component={NotFound} />
                </Switch>
            </main>
        );
    }
}

export default Main;

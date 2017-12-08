import { Component, Fragment, createElement } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { render } from 'react-dom';
import createStore from './store';

class Peregrine extends Component {
    constructor(props) {
        super(props);

        this.store = createStore();
    }

    static mount() {
        render(...arguments);
    }

    render() {
        const { props, store } = this;

        return (
            <Provider store={store}>
                <BrowserRouter>
                    <Fragment>{props.children}</Fragment>
                </BrowserRouter>
            </Provider>
        );
    }
}

export default Peregrine;

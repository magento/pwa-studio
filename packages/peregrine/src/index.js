import { createElement } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { render } from 'react-dom';
import createStore from './store';

/**
 * @class
 * @prop {Component} component
 * @prop {Element} container
 * @prop {ReactElement} element
 * @prop {Store} store
 */
class Peregrine {
    /**
     * Create a Peregrine instance.
     *
     * @param {Promise<Component>} component The root component.
     */
    constructor(component) {
        this.component = component;
        this.store = createStore();
    }

    /**
     * Create an instance of the root component, wrapped with store and routing
     * components.
     *
     * @returns {ReactElement}
     */
    render() {
        const { component: Component, store } = this;

        return (
            <Provider store={store}>
                <BrowserRouter>
                    <Component />
                </BrowserRouter>
            </Provider>
        );
    }

    /**
     * Render and mount the React tree into a DOM element.
     *
     * @param {Element} container The target DOM element.
     * @param {Function} callback A function called after mounting.
     * @returns {void}
     */
    mount(container) {
        this.container = container;
        this.element = this.render();

        return render(this.element, ...arguments);
    }

    /**
     * Add a reducer (slice) to the store (root).
     * The store replaces the root reducer with one containing the new slice.
     *
     * @param {String} key The name of the slice.
     * @param {Function} reducer The reducing function.
     * @returns {void}
     */
    addReducer(key, reducer) {
        this.store.addReducer(key, reducer);
    }
}

export default Peregrine;

import { createElement } from 'react';
import { Provider } from 'react-redux';
import { render } from 'react-dom';
import createStore from '../store';
import MagentoRouter from '../Router';

/**
 * @class
 * @prop {Element} container
 * @prop {ReactElement} element
 * @prop {Store} store
 * @prop {string} apiBase
 * @prop {string} __tmp_webpack_public_path__
 */
class Peregrine {
    /**
     * Create a Peregrine instance.
     * @param {object} opts
     * @param {string} opts.apiBase Base URL for the store's GraphQL API, including host/port
     * @param {string} opts.__tmp_webpack_public_path__ Temporary until PWA module extends GraphQL API
     */
    constructor(opts = {}) {
        const { apiBase = location.origin, __tmp_webpack_public_path__ } = opts;
        this.apiBase = apiBase;
        this.__tmp_webpack_public_path__ = __tmp_webpack_public_path__;
        if (!__tmp_webpack_public_path__ && process.env.NODE_ENV === 'test') {
            // Since __tmp_webpack_public_path__ is temporary, we're
            // defaulting it here in tests to lessen tests that need to change
            // when this property is removed
            this.__tmp_webpack_public_path__ = 'https://temporary.com/pub';
        }
        this.store = createStore();
        this.container = null;
        this.element = null;
    }

    /**
     * Create an instance of the root component, wrapped with store and routing
     * components.
     *
     * @returns {ReactElement}
     */
    render() {
        const { store, apiBase, __tmp_webpack_public_path__ } = this;

        return (
            <Provider store={store}>
                <MagentoRouter {...{ apiBase, __tmp_webpack_public_path__ }} />
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

        render(this.element, ...arguments);
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

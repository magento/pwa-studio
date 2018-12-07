/**
 * The real implementation of `classify` interferes with Enzyme tests, which
 * use class selectors to confirm UI states. CSS modules have dynamic classes.
 *
 * The simple solution is to use `identity-obj-proxy` to mock CSS modules,
 * which our jest.config.js does do. But the real implementation of `classify`
 * shadows the mock and disables its special functionality.
 *
 * This mock implementation passes the identity-obj-proxy through instead.
 */
import React, { Component } from 'react';
import idObj from 'identity-obj-proxy';

const classify = () => WrappedComponent =>
    class extends Component {
        static displayName = `Classify(${WrappedComponent.displayName ||
            WrappedComponent.name})`;

        render() {
            return <WrappedComponent {...this.props} classes={idObj} />;
        }
    };

export default classify;

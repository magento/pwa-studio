/**
 * Note: This component should be moved to `peregrine` repository.
 * It lives in this repo currently because this package consumes it, and we
 * don't have private npm packages yet
 */

import React from 'react';

const errorStyles = {
    background: '#ff1b1b',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: '1em',
    fontFamily: 'sans-serif'
};

export default class MagentoExtensionBoundary extends React.Component {
    constructor() {
        super();
        this.state = {
            hasError: false
        };
    }

    componentDidCatch() {
        const { replacedID } = this.props;
        console.error(
            'An error occurred within a part of the React component tree ' +
                'created by a Magento Extension. Look for the component registered ' +
                `to replace the mid "%c${replacedID}%c" to debug further.`
        );
        this.setState({ hasError: true });
    }

    render() {
        if (!this.state.hasError) {
            return this.props.children;
        }

        return (
            <div style={errorStyles}>
                An error occurred within a Magento Extension. See the browser's
                JavaScript console for further details.
            </div>
        );
    }
}

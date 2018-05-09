import { Component } from 'react';
import { func, string } from 'prop-types';

class SimulatorErrorBoundary extends Component {
    static propTypes = {
        what: string.isRequired,
        when: string.isRequired,
        handler: func
    };

    componentDidCatch(e, info) {
        const { what, when, handler } = this.props;
        const renderError = new Error(
            `${what} subtree threw an error ${when}: ${e.message}\n${info &&
                info.componentStack}`
        );
        Object.assign(renderError, this.state, info);

        if (handler) {
            handler(renderError, info);
        } else {
            throw renderError;
        }
    }

    render() {
        return this.props.children;
    }
}

export default SimulatorErrorBoundary;

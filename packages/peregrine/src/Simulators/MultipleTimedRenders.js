import { createElement, Component } from 'react';
import { arrayOf, oneOfType, shape, func, number, any } from 'prop-types';
import SimulatorErrorBoundary from './SimulatorErrorBoundary';
import scheduleCallbackArgs from './schedule-callback-args';

export default class MultipleTimedRenders extends Component {
    static propTypes = {
        initialArgs: oneOfType([arrayOf(any), func]),
        scheduledArgs: arrayOf(
            shape({
                elapsed: number.isRequired,
                args: oneOfType([arrayOf(any), func]).isRequired
            }).isRequired
        ).isRequired,
        /* (error: Error) => any */
        onError: func,
        /* (prop: any) => React.Element<any> */
        children: func.isRequired
    };

    static defaultProps = {
        onError: e => {
            throw e;
        }
    };

    state = {
        args:
            typeof this.props.initialArgs === 'function'
                ? this.props.initialArgs()
                : this.props.initialArgs
    };

    componentDidMount() {
        this._pending = scheduleCallbackArgs(
            this.props.scheduledArgs,
            (...args) => this.setState({ args }),
            e =>
                this.props.onError(
                    new Error(`Could not retrieve arguments: ${e.message}`)
                )
        );
    }

    componentWillUnmount() {
        this._pending.cancel();
    }

    render() {
        return this.state.args ? (
            <SimulatorErrorBoundary
                what={this.constructor.name}
                when="after receiving props"
                handler={this.props.onError}
            >
                {this.props.children(...this.state.args)}
            </SimulatorErrorBoundary>
        ) : null;
    }
}

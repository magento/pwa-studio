import { createElement, Component } from 'react';
import { func, number, any } from 'prop-types';
import MultipleTimedRenders from './MultipleTimedRenders';
import SimulatorErrorBoundary from './SimulatorErrorBoundary';

class DelayedValue extends Component {
    static propTypes = {
        initial: any,
        delay: number.isRequired,
        updated: any.isRequired,
        onError: func,
        /* (prop: any) => React.Element<any> */
        children: func.isRequired
    };

    render() {
        const { delay, updated, initial, onError, children } = this.props;
        const initialArgs = initial && [initial];

        return (
            <SimulatorErrorBoundary
                what={this.constructor.name}
                when="after updated value"
                handler={onError}
            >
                <MultipleTimedRenders
                    scheduledArgs={[
                        {
                            elapsed: delay,
                            args: [updated]
                        }
                    ]}
                    initialArgs={initialArgs}
                    onError={onError}
                >
                    {children}
                </MultipleTimedRenders>
            </SimulatorErrorBoundary>
        );
    }
}

export default DelayedValue;

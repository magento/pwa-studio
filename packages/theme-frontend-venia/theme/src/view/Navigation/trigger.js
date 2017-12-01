import { Component, createElement } from 'react';
import { connect } from 'react-redux';

const defaultClassName = 'NavigationTrigger';

class Trigger extends Component {
    render() {
        const { children, className, nav } = this.props;

        return (
            <button
                className={className || defaultClassName}
                onClick={this.handleClick}
            >
                {children}
            </button>
        );
    }

    handleClick = ev => {
        this.props.dispatch({ type: 'TOGGLE_NAVIGATION' });
    };
}

export default connect()(Trigger);

export { Trigger };

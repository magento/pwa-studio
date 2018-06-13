import { Component, createElement } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';

import classify from 'src/classify';
import defaultClasses from './trigger.css';

class Trigger extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            root: PropTypes.string
        })
    };

    render() {
        const { children, classes } = this.props;

        return (
            <button className={classes.root} onClick={this.handleClick}>
                {children}
            </button>
        );
    }

    handleClick = () => {
        this.props.dispatch({ type: 'TOGGLE_NAVIGATION' });
    };
}

export default compose(classify(defaultClasses), connect())(Trigger);

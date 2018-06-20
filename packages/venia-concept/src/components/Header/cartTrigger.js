import { Component, createElement } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import PropTypes from 'prop-types';

import classify from 'src/classify';
import defaultClasses from './cartTrigger.css';

class Trigger extends Component {
    static propTypes = {
        children: PropTypes.node,
        classes: PropTypes.shape({
            root: PropTypes.string
        }),
        openCart: PropTypes.func.isRequired
    };

    render() {
        const { children, classes, openCart } = this.props;

        return (
            <button className={classes.root} onClick={openCart}>
                {children}
            </button>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    openCart: () => dispatch({ type: 'TOGGLE_DRAWER', payload: 'cart' })
});

export default compose(
    classify(defaultClasses),
    connect(
        null,
        mapDispatchToProps
    )
)(Trigger);

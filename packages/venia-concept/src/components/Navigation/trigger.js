import { Component, createElement } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import PropTypes from 'prop-types';

import classify from 'src/classify';
import defaultClasses from './trigger.css';

class NavTrigger extends Component {
    static propTypes = {
        children: PropTypes.node,
        classes: PropTypes.shape({
            root: PropTypes.string
        }),
        closeNav: PropTypes.func.isRequired
    };

    render() {
        const { children, classes, closeNav } = this.props;

        return (
            <button className={classes.root} type="button" onClick={closeNav}>
                {children}
            </button>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    closeNav: () => dispatch({ type: 'TOGGLE_DRAWER', payload: null })
});

export default compose(
    classify(defaultClasses),
    connect(
        null,
        mapDispatchToProps
    )
)(NavTrigger);

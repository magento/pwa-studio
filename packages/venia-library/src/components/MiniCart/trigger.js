import React, { Component } from 'react';
import { connect } from 'src/drivers';
import { compose } from 'redux';
import PropTypes from 'prop-types';

import classify from 'src/classify';
import { closeDrawer } from 'src/actions/app';
import defaultClasses from './trigger.css';

class Trigger extends Component {
    static propTypes = {
        children: PropTypes.node,
        classes: PropTypes.shape({
            root: PropTypes.string
        }),
        closeDrawer: PropTypes.func
    };

    render() {
        const { children, classes, closeDrawer } = this.props;

        return (
            <button className={classes.root} onClick={closeDrawer}>
                {children}
            </button>
        );
    }
}

const mapDispatchToProps = { closeDrawer };

export default compose(
    classify(defaultClasses),
    connect(
        null,
        mapDispatchToProps
    )
)(Trigger);

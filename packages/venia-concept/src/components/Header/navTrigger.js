import React, { Component } from 'react';
import { connect } from 'src/drivers';
import { compose } from 'redux';
import PropTypes from 'prop-types';

import classify from 'src/classify';
import { toggleDrawer } from 'src/actions/app';
import defaultClasses from './navTrigger.css';

class Trigger extends Component {
    static propTypes = {
        children: PropTypes.node,
        classes: PropTypes.shape({
            root: PropTypes.string
        }),
        openNav: PropTypes.func.isRequired
    };

    render() {
        const { children, classes, openNav } = this.props;

        return (
            <button
                className={classes.root}
                aria-label="Toggle navigation panel"
                onClick={openNav}
            >
                {children}
            </button>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    openNav: () => dispatch(toggleDrawer('nav'))
});

export default compose(
    classify(defaultClasses),
    connect(
        null,
        mapDispatchToProps
    )
)(Trigger);

import React from 'react';
import { connect } from '@magento/venia-drivers';
import { func, node, shape, string } from 'prop-types';

import { mergeClasses } from '../../classify';
import { toggleDrawer } from '../../actions/app';
import defaultClasses from './navTrigger.css';

const Trigger = props => {
    const classes = mergeClasses(defaultClasses, props.classes);

    const { children, openNav } = props;

    return (
        <button
            className={classes.root}
            aria-label="Toggle navigation panel"
            onClick={openNav}
        >
            {children}
        </button>
    );
};

Trigger.propTypes = {
    children: node,
    classes: shape({
        root: string
    }),
    openNav: func.isRequired
};

const mapDispatchToProps = dispatch => ({
    openNav: () => dispatch(toggleDrawer('nav'))
});

export default connect(
    null,
    mapDispatchToProps
)(Trigger);

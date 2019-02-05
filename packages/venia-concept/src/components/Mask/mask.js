import React, { Component } from 'react';
import PropTypes from 'prop-types';

import classify from 'src/classify';
import defaultClasses from './mask.css';

class Mask extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            root: PropTypes.string,
            root_active: PropTypes.string
        }),
        dismiss: PropTypes.func,
        isActive: PropTypes.bool,
        opacity: PropTypes.number
    };

    static defaultProps = {
        opacity: 0.5
    };

    render() {
        const { classes, dismiss, isActive, opacity } = this.props;
        const className = isActive ? classes.root_active : classes.root;
        const style = isActive ? { opacity } : {};

        return <button className={className} onClick={dismiss} style={style} />;
    }
}

export default classify(defaultClasses)(Mask);

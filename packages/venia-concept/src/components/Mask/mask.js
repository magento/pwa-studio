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
        isActive: PropTypes.bool
    };

    render() {
        const { classes, dismiss, isActive } = this.props;
        const className = isActive ? classes.root_active : classes.root;

        return <button className={className} onClick={dismiss} />;
    }
}

export default classify(defaultClasses)(Mask);

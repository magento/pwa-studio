import React, { Component } from 'react';
import Feather from 'feather-icons';
import PropTypes from 'prop-types';

import classify from 'src/classify';
import defaultClasses from './icon.css';

class Icon extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            root: PropTypes.string
        })
    };

    render() {
        const { attrs, classes, name } = this.props;
        const svg = Feather.icons[name].toSvg(attrs);
        const fn = () => ({ __html: svg });

        return <span className={classes.root} dangerouslySetInnerHTML={fn()} />;
    }
}

export default classify(defaultClasses)(Icon);

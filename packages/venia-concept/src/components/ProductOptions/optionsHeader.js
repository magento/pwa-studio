import React, { Component } from 'react';
import PropTypes from 'prop-types';
import defaultClasses from './optionsHeader.css';
import classify from 'src/classify';

class OptionsHeader extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            root: PropTypes.string,
        }),
        title: PropTypes.string,
        helpText: PropTypes.string,
        helpClick: PropTypes.func
    }

    render() {
        const { title, helpText, helpClick, classes, children } = this.props;
        return (
            <div className={classes.root}>
                <div className={classes.header}>
                    <span className={classes.title}> {title} </span>
                    <span className={classes.helpText} onClick={() => helpClick()}> {helpText} </span>
                </div>
                { children }
            </div>
        );
    }
}

export default classify(defaultClasses)(OptionsHeader);

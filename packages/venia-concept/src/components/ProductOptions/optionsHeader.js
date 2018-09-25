import { Component, createElement } from 'react';
import PropTypes from 'prop-types';
import defaultClasses from './optionsHeader.css';

class OptionsHeader extends Component {
    static propTypes = {
        classes: shape({
            root: PropTypes.string,
        }),
        title: PropTypes.string,
        helpText: PropTypes.string,
        helpClick: PropTypes.func
    }

    render() {
        const { title, helpText, helpClick, classes } = this.props;
        return (
            <div className={classes.root}>
                <span className={classes.title}> {title} </span>
                <span className={classes.helpText} onClick={() => helpClick}> {helpText} </span>
            </div>
        );
    }
}

export default classify(defaultClasses)(OptionsHeader);

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import defaultClasses from './checkbox.css';
import classify from 'src/classify';
import Icon from 'src/components/Icon';

class Checkbox extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            root: PropTypes.string,
            checkbox: PropTypes.string,
            highlighted: PropTypes.string,
            label: PropTypes.string
        }),
        select: PropTypes.func,
        initialState: PropTypes.bool
    };

    state = {
        focused: false,
        checked: this.props.initialState
    };

    handleClick = () => {
        const checked = !this.state.checked;
        this.setState({
            checked: checked
        });
        this.props.select(checked);
    };

    handleKeyUp = evt => {
        if (evt.key === 'Enter') {
            this.handleClick();
        }
    };

    focus = () => {
        this.setState({ focused: true });
    };

    blur = () => {
        this.setState({ focused: false });
    };

    get label() {
        const { classes, label } = this.props;
        return <span className={classes.label}> {label} </span>;
    }

    get checkbox() {
        const { classes, label } = this.props;
        let checkedIcon;

        this.state.checked
            ? (checkedIcon = 'check-square')
            : (checkedIcon = 'square');
        return (
            <span>
                <Icon name={checkedIcon} />
                <span className={classes.label}> {label} </span>
            </span>
        );
    }

    render() {
        const { classes } = this.props;
        const { checkbox } = this;

        let rootClass = `${classes.root} `;
        this.state.focused ? (rootClass += `${classes.highlighted}`) : null;

        return (
            <div
                className={rootClass}
                onClick={this.handleClick}
                onFocus={this.focus}
                onBlur={this.blur}
                onKeyUp={evt => this.handleKeyUp(evt)}
                aria-checked={this.state.checked}
                role="checkbox"
                tabIndex={0}
            >
                <span className={classes.checkbox}>{checkbox}</span>
            </div>
        );
    }
}

export default classify(defaultClasses)(Checkbox);

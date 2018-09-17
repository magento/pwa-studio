import { createElement, Component } from 'react';
import PropTypes from 'prop-types';
import defaultClasses from './checkbox.css';
import classify from 'src/classify';
import Icon from 'src/components/Icon';

class Checkbox extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            root: PropTypes.string,
            label: PropTypes.string
        }),
        select: PropTypes.func,
        initialState: PropTypes.bool
    };

    state = {
        checked: this.props.initialState
    }

    handleClick = () => {
        const checked = !this.state.checked;
        this.setState({
            checked: checked
        })
        this.props.select(checked);
    }

    get checkbox() {
        return this.state.checked ? (
            <Icon name="check-square"/>
        ) : <Icon name="square"/>
    }

    render() {
        const { classes, label } = this.props;
        const { checkbox } = this;
        return  (
            <div
                className={classes.root}
                onClick={this.handleClick}
                onKeyUp={this.handleClick}
                aria-checked={this.state.checked}
                role="checkbox"
                tabIndex={0}>
                    {checkbox}
                    <span className={classes.label}> {label} </span>
            </div>
        )
    }
}

export default classify(defaultClasses)(Checkbox);

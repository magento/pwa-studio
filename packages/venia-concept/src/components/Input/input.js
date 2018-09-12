import { Component, createElement } from 'react';
import { PropTypes } from 'prop-types';
import defaultClasses from './input.css';
import classify from 'src/classify';

class Input extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            helpText: PropTypes.string,
            errorText: PropTypes.string,
            successText: PropTypes.string,
            label: PropTypes.string,
            labelFocused: PropTypes.string,
            root: PropTypes.string
        }),

        value: PropTypes.string,
        placeholder: PropTypes.string,
        label: PropTypes.string.isRequired,
        type: PropTypes.string,
        disabled: PropTypes.bool,
        required: PropTypes.bool,

        helpText: PropTypes.string,
        errorText: PropTypes.string,
        successText: PropTypes.string,
        helpVisible: PropTypes.bool,
        errorVisible: PropTypes.bool,
        successVisible: PropTypes.bool,

        onChange: PropTypes.func
    };

    static defaultProps = {
        disabled: false,
        helpVisible: true
    };

    state = {
        value: '',
        focused: false,
        dirty: false
    };

    get helpText() {
        const { helpVisible, classes, helpText } = this.props;
        return helpVisible ? (
            <div className={classes.helpText}>{helpText}</div>
        ) : null;
    }

    get errorText() {
        const { errorVisible, classes, errorText } = this.props;
        return errorVisible && this.state.dirty ? (
            <div className={classes.errorText}>{errorText}</div>
        ) : null;
    }

    get successText() {
        const { successVisible, classes, successText } = this.props;
        return successVisible ? (
            <div className={classes.successText}>{successText}</div>
        ) : null;
    }

    get labelText() {
        const { classes, label } = this.props;
        let className = `${classes.label}`;
        if (this.state.focused) {
            className += ` ${classes.labelFocused}`;
        }
        return <div className={className}>{label}</div>;
    }

    render() {
        const { helpText, errorText, successText, labelText } = this;
        const {
            value,
            placeholder,
            type,
            disabled,
            required,
            classes
        } = this.props;

        return (
            <div className={classes.root}>
                {labelText}
                <input
                    value={value}
                    placeholder={placeholder}
                    type={type}
                    disabled={disabled}
                    required={required}
                    onChange={this.handleChange}
                    onFocus={this.focusTextInput}
                    onBlur={this.blurTextInput}
                />
                {helpText}
                {errorText}
                {successText}
            </div>
        );
    }

    handleChange = event => {
        this.setState({ value: event.target.value });
        this.props.onChange ? this.props.onChange(event.target.value) : null;
    };

    focusTextInput = () => {
        this.setState({ focused: true });
    };

    blurTextInput = () => {
        this.setState({ focused: false });
        this.makeDirty();
    };

    makeDirty = () => {
        if (!this.state.dirty) {
            this.setState({ dirty: true });
        }
    };
}

export default classify(defaultClasses)(Input);

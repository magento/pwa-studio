import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import defaultClasses from './input.css';
import classify from 'src/classify';
import { Text } from 'informed';

export const HelpTypes = {
    hint: 'hint',
    error: 'error',
    success: 'success'
};

class Input extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            helpText: PropTypes.string,
            hint: PropTypes.string,
            error: PropTypes.string,
            success: PropTypes.string,
            label: PropTypes.string,
            labelFocused: PropTypes.string,
            root: PropTypes.string,
            input: PropTypes.string,
            rootFocused: PropTypes.string
        }),

        initialValue: PropTypes.string,
        placeholder: PropTypes.string,
        label: PropTypes.string.isRequired,
        type: PropTypes.string,
        disabled: PropTypes.bool,
        required: PropTypes.bool,
        title: PropTypes.string,
        autoComplete: PropTypes.string,
        helpText: PropTypes.string,
        helpType: PropTypes.string,
        field: PropTypes.string.isRequired,
        onChange: PropTypes.func
    };

    static defaultProps = {
        disabled: false,
        helpVisible: true,
        helpType: HelpTypes.hint
    };

    componentDidMount() {
        const { initialValue, onChange } = this.props;

        if (initialValue && onChange) {
            onChange(initialValue);
        }
    }

    state = {
        value: this.props.initialValue,
        focused: false,
        dirty: false
    };

    get helpText() {
        const { helpVisible, classes, helpText, helpType } = this.props;
        let helpTypeClass = `${classes.helpText} ${classes[helpType]}`;

        return helpVisible ? (
            <div className={helpTypeClass}>{helpText}</div>
        ) : null;
    }

    get labelText() {
        const { classes, label } = this.props;
        let className = `${classes.label}`;
        if (this.state.focused) {
            className += ` ${classes.labelFocused}`;
        }
        return <span className={className}>{label}</span>;
    }

    get rootClass() {
        const { classes } = this.props;
        let className = `${classes.root}`;
        if (this.state.focused) {
            className += ` ${classes.rootFocused}`;
        }
        return className;
    }

    get requiredSymbol() {
        const { classes, required } = this.props;
        return required ? <div className={classes.requiredSymbol} /> : null;
    }

    render() {
        const { helpText, labelText, requiredSymbol, rootClass } = this;
        const {
            classes,
            placeholder,
            type,
            disabled,
            required,
            title,
            initialValue
        } = this.props;
        let { autoComplete, field } = this.props;

        if (!this.state.dirty) {
            field = initialValue ? initialValue : field;
        }
        autoComplete = !autoComplete ? 'off' : autoComplete;

        return (
            <div className={rootClass}>
                <span className={classes.label}>
                    {requiredSymbol}&nbsp;{labelText}
                </span>
                <Text
                    initialValue={initialValue}
                    className={classes.input}
                    placeholder={placeholder}
                    type={type}
                    disabled={disabled}
                    required={required}
                    title={title}
                    autoComplete={autoComplete}
                    onChange={this.handleChange}
                    onFocus={this.focusTextInput}
                    onBlur={this.blurTextInput}
                    field={field}
                />
                {helpText}
            </div>
        );
    }

    handleChange = event => {
        this.setState({ value: event.target.value });
        this.props.onChange ? this.props.onChange(event.target.value) : null;
        this.makeDirty();
    };

    focusTextInput = () => {
        this.setState({ focused: true });
    };

    blurTextInput = () => {
        this.setState({ focused: false });
    };

    makeDirty = () => {
        if (!this.state.dirty) {
            this.setState({ dirty: true });
        }
    };
}

export default classify(defaultClasses)(Input);

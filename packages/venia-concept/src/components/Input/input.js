import React, { Component, Fragment } from 'react';
import { compose } from 'redux';
import { PropTypes } from 'prop-types';
import { BasicText, asField } from 'informed';
import defaultClasses from './input.css';
import classify from 'src/classify';
import Icon from 'src/components/Icon';
import { resetButtonIcon, HelpTypes } from './constants';

//TODO: try to incapsulate default validatorRequired in Input component
// so you don't need to pass validator apart from required prop
export class Input extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            hint: PropTypes.string,
            error: PropTypes.string,
            success: PropTypes.string,
            helpTextBlock: PropTypes.string,
            label: PropTypes.string,
            labelFocused: PropTypes.string,
            root: PropTypes.string,
            input: PropTypes.string,
            inputContainer: PropTypes.string,
            rootFocused: PropTypes.string,
            resetInput: PropTypes.string
        }),
        selected: PropTypes.bool,
        initialValue: PropTypes.string,
        placeholder: PropTypes.string,
        label: PropTypes.string.isRequired,
        type: PropTypes.string,
        disabled: PropTypes.bool,
        required: PropTypes.bool,
        title: PropTypes.string,
        autoComplete: PropTypes.string,
        helpType: PropTypes.string,
        helpText: PropTypes.string,
        field: PropTypes.string.isRequired,
        onChange: PropTypes.func,
        fieldState: PropTypes.object,
        fieldApi: PropTypes.object
    };

    static defaultProps = {
        selected: false,
        initialValue: '',
        disabled: false,
        helpType: HelpTypes.hint,
        helpText: ''
    };

    constructor(props) {
        super(props);
        this.state = {
            focused: false
        };
        this.inputRef = React.createRef();
    }

    componentDidMount() {
        const {
            props: { selected },
            inputRef
        } = this;
        selected && inputRef.current.focus();
    }

    getValidationError = errorText => (
        <div className={this.props.classes[HelpTypes.error]}>{errorText}</div>
    );

    getHelpText = ({ helpText, helpType }) => (
        <div className={this.props.classes[helpType]}>{helpText}</div>
    );

    get helpTextSection() {
        const {
            helpText,
            helpType,
            fieldState: { error }
        } = this.props;

        return (
            <Fragment>
                {helpText ? this.getHelpText({ helpText, helpType }) : null}
                {error ? this.getValidationError(error) : null}
            </Fragment>
        );
    }

    get labelText() {
        const { classes, label } = this.props;
        const className = !this.state.focused
            ? classes.label
            : classes.labelFocused;
        return <span className={className}>{label}</span>;
    }

    get rootClass() {
        const { classes } = this.props;
        let className = !this.state.focused
            ? classes.root
            : classes.rootFocused;
        return className;
    }

    get requiredSymbol() {
        const { classes, required } = this.props;
        return required ? <div className={classes.requiredSymbol} /> : null;
    }

    get resetButton() {
        const { classes, fieldState } = this.props;
        const { name, attrs } = resetButtonIcon;

        return fieldState.value ? (
            <button
                type="button"
                className={classes.resetInput}
                onClick={this.resetValue}
            >
                <Icon name={name} attrs={attrs} />
            </button>
        ) : null;
    }

    //TODO: setValue doesn't trigger onChange of the field, so callbacks from outside
    // don't know about value changing when clicking reset button,
    // on other hand if manually triggering onChange callback
    // setValue sets value in async way and at the moment of calling onChange callback
    // value of a field in the formState is old
    resetValue = () => {
        const { fieldApi } = this.props;
        fieldApi.setValue(null);
        this.handleChange();
    };

    render() {
        const {
            helpTextSection,
            labelText,
            requiredSymbol,
            rootClass,
            resetButton
        } = this;
        const {
            classes,
            placeholder,
            type,
            disabled,
            title,
            initialValue,
            field,
            fieldApi,
            fieldState
        } = this.props;
        let { autoComplete } = this.props;

        autoComplete = !autoComplete ? 'off' : autoComplete;

        return (
            <div className={rootClass}>
                <span className={classes.label}>
                    {requiredSymbol} {labelText}
                </span>
                <div className={classes.inputContainer}>
                    <BasicText
                        fieldApi={fieldApi}
                        fieldState={fieldState}
                        forwardedRef={this.inputRef}
                        initialValue={initialValue}
                        className={classes.input}
                        placeholder={placeholder}
                        type={type}
                        disabled={disabled}
                        title={title}
                        autoComplete={autoComplete}
                        onChange={this.handleChange}
                        onFocus={this.focusTextInput}
                        onBlur={this.blurTextInput}
                        field={field}
                    />
                    {resetButton}
                </div>
                {helpTextSection}
            </div>
        );
    }

    handleChange = () => {
        const {
            onChange,
            fieldState: { value }
        } = this.props;
        onChange && onChange(value);
    };

    focusTextInput = () => {
        this.setState({ focused: true });
    };

    blurTextInput = () => {
        this.setState({ focused: false });
    };
}

export default compose(
    classify(defaultClasses),
    asField
)(Input);

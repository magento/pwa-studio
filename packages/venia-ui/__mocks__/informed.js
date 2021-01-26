import React from 'react';

const informed = jest.requireActual('informed');
const {
    Text,
    Input,
    Radio,
    TextArea,
    Select,
    Option,
    Checkbox,
    RadioGroup,
    BasicText,
    BasicRadio,
    BasicRadioGroup,
    BasicTextArea,
    BasicSelect,
    BasicCheckbox,
    Scope,
    ArrayField,
    asField,
    ...rest
} = informed;

const wrapWithUuidPropCheck = Component => props => {
    const newProps = { ...props };
    const uuid4Regex = new RegExp(
        /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i
    );
    const hasUuidIdProp =
        props.hasOwnProperty('id') && uuid4Regex.test(props.id);

    if (!props.hasOwnProperty('id') || hasUuidIdProp) {
        if (props.hasOwnProperty('field')) {
            newProps.id = props.field;
        } else {
            newProps.id = 'SAMPLE-ID';
        }
    }

    return <Component {...newProps} />;
};

module.exports = {
    ...rest,
    Text: wrapWithUuidPropCheck(Text),
    Input: wrapWithUuidPropCheck(Input),
    Radio: wrapWithUuidPropCheck(Radio),
    TextArea: wrapWithUuidPropCheck(TextArea),
    Select: wrapWithUuidPropCheck(Select),
    Option: wrapWithUuidPropCheck(Option),
    Checkbox: wrapWithUuidPropCheck(Checkbox),
    RadioGroup: wrapWithUuidPropCheck(RadioGroup),
    BasicText: wrapWithUuidPropCheck(BasicText),
    BasicRadio: wrapWithUuidPropCheck(BasicRadio),
    BasicRadioGroup: wrapWithUuidPropCheck(BasicRadioGroup),
    BasicTextArea: wrapWithUuidPropCheck(BasicTextArea),
    BasicSelect: wrapWithUuidPropCheck(BasicSelect),
    BasicCheckbox: wrapWithUuidPropCheck(BasicCheckbox),
    Scope: wrapWithUuidPropCheck(Scope),
    ArrayField: wrapWithUuidPropCheck(ArrayField),
    asField: Component => {
        const WrappedComponent = asField(Component);

        return props => {
            const newProps = { ...props };
            const uuid4Regex = new RegExp(
                /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i
            );
            const hasUuidIdProp =
                props.hasOwnProperty('id') && uuid4Regex.test(props.id);

            if (!props.hasOwnProperty('id') || hasUuidIdProp) {
                if (props.hasOwnProperty('field')) {
                    newProps.id = props.field;
                } else {
                    newProps.id = 'SAMPLE-ID';
                }
            }

            return <WrappedComponent {...newProps} />;
        };
    }
};

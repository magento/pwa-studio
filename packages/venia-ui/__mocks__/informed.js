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

/**
 * HoC to wrap informed form field components. This HoC modifies
 * the ID prop of the given component and replaces it with the
 * value of the field prop if available. If not it replaces it with
 * a sample value `SAMPLE_ID`.
 *
 * We are doing this because the new version of informed added a feature
 * to use UUID as the value of the ID prop if one is not provided.
 * This is breaking all our snapshot tests because a new ID is created
 * every time the component renders.
 *
 * https://github.com/joepuzzo/informed/blob/master/src/utils.js#L123
 *
 * @param {ReactComponent} Component component to wrap
 *
 * @returns {ReactComponent}
 */
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
    asField: Component => wrapWithUuidPropCheck(asField(Component))
};

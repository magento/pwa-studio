import React, { Fragment } from 'react';
// import { arrayOf, node, number, oneOfType, shape, string } from 'prop-types';
import {
    Option as InformedOption,
    Select as InformedSelect,
    useFieldState
} from 'informed';

import { useStyle } from '../../classify';
import { FieldIcons, Message } from '../Field';
import defaultClasses from './select.css';
import Icon from '../Icon';
import { ChevronDown as ChevronDownIcon } from 'react-feather';

const arrow = <Icon src={ChevronDownIcon} size={24} />;

const Select = props => {
    const {
        before,
        classes: propClasses,
        field,
        items,
        message,
        ...rest
    } = props;
    const fieldState = useFieldState(field);
    const classes = useStyle(defaultClasses, propClasses);
    const inputClass = fieldState.error ? classes.input_error : classes.input;

    const options = items.map(
        ({ disabled = null, hidden = null, label, value, key = value }) => (
            <InformedOption
                key={key}
                disabled={disabled}
                hidden={hidden}
                value={value}
            >
                {label || (value != null ? value : '')}
            </InformedOption>
        )
    );

    return (
        <Fragment>
            <FieldIcons after={arrow} before={before}>
                <InformedSelect {...rest} className={inputClass} field={field}>
                    {options}
                </InformedSelect>
            </FieldIcons>
            <Message fieldState={fieldState}>{message}</Message>
        </Fragment>
    );
};

export default Select;

// class Select extends Component {
//     static propTypes = {
//         classes: shape({
//             input: string
//         }),
//         field: string.isRequired,
//         fieldState: shape({
//             value: oneOfType([number, string])
//         }),
//         items: arrayOf(
//             shape({
//                 key: oneOfType([number, string]),
//                 label: string,
//                 value: oneOfType([number, string])
//             })
//         ),
//         message: node
//     };

//     render() {
//         const { classes, fieldState, items, message, ...rest } = this.props;
//         const options = items.map(
//             ({ disabled = null, hidden = null, label, value, key = value }) => (
//                 <Option
//                     disabled={disabled}
//                     hidden={hidden}
//                     key={key}
//                     value={value}
//                 >
//                     {label || (value != null ? value : '')}
//                 </Option>
//             )
//         );

//         const inputClass = fieldState.error
//             ? classes.input_error
//             : classes.input;

//         return (
//             <Fragment>
//                 <FieldIcons after={arrow}>
//                     <BasicSelect
//                         {...rest}
//                         fieldState={fieldState}
//                         className={inputClass}
//                     >
//                         {options}
//                     </BasicSelect>
//                 </FieldIcons>
//                 <Message fieldState={fieldState}>{message}</Message>
//             </Fragment>
//         );
//     }
// }

// export default compose(
//     classify(defaultClasses),
//     asField
// )(Select);

import React, { Fragment } from 'react';
// import { node, number, oneOfType, shape, string } from 'prop-types';
import { Text as InformedText, useFieldState } from 'informed';

import { useStyle } from '../../classify';
import { FieldIcons, Message } from '../Field';
import defaultClasses from './textInput.css';

const TextInput = props => {
    const {
        after,
        before,
        classes: propClasses,
        field,
        message,
        ...rest
    } = props;
    const fieldState = useFieldState(field);
    const classes = useStyle(defaultClasses, propClasses);
    const inputClass = fieldState.error ? classes.input_error : classes.input;

    return (
        <Fragment>
            <FieldIcons after={after} before={before}>
                <InformedText {...rest} className={inputClass} field={field} />
            </FieldIcons>
            <Message fieldState={fieldState}>{message}</Message>
        </Fragment>
    );
};

export default TextInput;

// export class TextInput extends Component {
//     static propTypes = {
//         after: node,
//         before: node,
//         classes: shape({
//             input: string
//         }),
//         fieldState: shape({
//             value: oneOfType([string, number])
//         }),
//         message: node
//     };

//     render() {
//         const {
//             after,
//             before,
//             classes,
//             fieldState,
//             message,
//             ...rest
//         } = this.props;

//         const inputClass = fieldState.error
//             ? classes.input_error
//             : classes.input;
//         return (
//             <Fragment>
//                 <FieldIcons after={after} before={before}>
//                     <BasicText
//                         {...rest}
//                         fieldState={fieldState}
//                         className={inputClass}
//                     />
//                 </FieldIcons>
//                 <Message fieldState={fieldState}>{message}</Message>
//             </Fragment>
//         );
//     }
// }

// export default compose(
//     classify(defaultClasses),
//     asField
// )(TextInput);

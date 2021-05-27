import React, { Fragment } from 'react';
// import { number, node, oneOf, oneOfType, shape, string } from 'prop-types';
import { TextArea as InformedTextArea, useFieldState } from 'informed';

import { useStyle } from '../../classify';
import { Message } from '../Field';
import defaultClasses from './textArea.css';

const TextArea = props => {
    const { classes: propClasses, field, message, ...rest } = props;
    const fieldState = useFieldState(field);
    const classes = useStyle(defaultClasses, propClasses);

    return (
        <Fragment>
            <InformedTextArea
                {...rest}
                className={classes.input}
                field={field}
            />
            <Message fieldState={fieldState}>{message}</Message>
        </Fragment>
    );
};

export default TextArea;

TextArea.defaultProps = {
    cols: 40,
    rows: 4,
    wrap: 'hard'
};

// export class TextArea extends Component {
//     static propTypes = {
//         classes: shape({
//             input: string
//         }),
//         cols: oneOfType([number, string]),
//         field: string.isRequired,
//         fieldState: shape({
//             value: string
//         }),
//         message: node,
//         rows: oneOfType([number, string]),
//         wrap: oneOf(['hard', 'soft'])
//     };

//     static defaultProps = {
//         cols: 40,
//         rows: 4,
//         wrap: 'hard'
//     };

//     render() {
//         const { classes, fieldState, message, ...rest } = this.props;

//         return (
//             <Fragment>
//                 <BasicTextArea
//                     {...rest}
//                     fieldState={fieldState}
//                     className={classes.input}
//                 />
//                 <Message fieldState={fieldState}>{message}</Message>
//             </Fragment>
//         );
//     }
// }

// export default compose(
//     classify(defaultClasses),
//     asField
// )(TextArea);

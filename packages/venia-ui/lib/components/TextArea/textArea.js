import React, { Fragment } from 'react';
import { number, node, oneOf, oneOfType, shape, string } from 'prop-types';
import { TextArea as InformedTextArea } from 'informed';
import useFieldState from '@magento/peregrine/lib/hooks/hook-wrappers/useInformedFieldStateWrapper';

import { useStyle } from '../../classify';
import { Message } from '../Field';
import defaultClasses from './textArea.module.css';

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

TextArea.propTypes = {
    classes: shape({
        input: string
    }),
    cols: oneOfType([number, string]),
    field: string.isRequired,
    message: node,
    rows: oneOfType([number, string]),
    wrap: oneOf(['hard', 'soft'])
};

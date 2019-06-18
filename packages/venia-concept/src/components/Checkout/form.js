import React from 'react';
import { oneOf, shape, string } from 'prop-types';

import { mergeClasses } from 'src/classify';

import EditableForm from './editableForm';
import Overview from './overview';
import defaultClasses from './form.css';

/**
 * The Form component is similar to Flow in that it renders either the overview
 * or the editable form based on the 'editing' state value.
 */
const Form = props => {
    const classes = mergeClasses(defaultClasses, props.classes);
    const child = props.editing ? (
        <EditableForm {...props} />
    ) : (
        <Overview classes={classes} {...props} />
    );

    return <div className={classes.root}>{child}</div>;
};

Form.propTypes = {
    classes: shape({
        root: string
    }),
    editing: oneOf(['address', 'paymentMethod', 'shippingMethod'])
};

export default Form;

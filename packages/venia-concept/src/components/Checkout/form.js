import React, { useState } from 'react';
import { shape, string } from 'prop-types';

import { mergeClasses } from '../../classify';

import EditableForm from './editableForm';
import Overview from './overview';
import defaultClasses from './form.css';

/**
 * The Form component is similar to Flow in that it renders either the overview
 * or the editable form based on the 'editing' state value.
 */
const Form = props => {
    const classes = mergeClasses(defaultClasses, props.classes);
    const [editing, setEditing] = useState(null);
    const child = editing ? (
        <EditableForm editing={editing} setEditing={setEditing} {...props} />
    ) : (
        <Overview classes={classes} {...props} setEditing={setEditing} />
    );

    return <div className={classes.root}>{child}</div>;
};

Form.propTypes = {
    classes: shape({
        root: string
    })
};

export default Form;

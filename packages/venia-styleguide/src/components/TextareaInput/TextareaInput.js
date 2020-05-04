import React from 'react';

import classes from './TextareaInput.css';

const TextareaInput = props => <textarea {...props} className={classes.root} />;

export default TextareaInput;

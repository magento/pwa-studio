import React, { createElement } from 'react';

import classes from './TextInput.css';

const TextInput = props => {
    const { after, before, type, ...restProps } = props;
    const isSelect = type === 'select';
    const elementType = isSelect ? type : 'input';
    const inputProps = { ...restProps, className: classes.input, key: 'input' };

    if (!isSelect) {
        inputProps.type = type;
    } else {
        console.log({ inputProps });
    }

    const inputElement = createElement(elementType, inputProps);
    const style = {
        '--after': after ? 1 : 0,
        '--before': before ? 1 : 0
    };

    return (
        <span className={classes.root} style={style}>
            {inputElement}
            <span className={classes.before}>{before}</span>
            <span className={classes.after}>{after}</span>
        </span>
    );
};

export default TextInput;

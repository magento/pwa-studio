import React from 'react';

import finalizeClasses from '../../util/finalizeClasses';
import classes from './ButtonGroup.css';

const ButtonGroup = props => {
    const { vertical } = props;
    const finalClasses = finalizeClasses(classes, { vertical });

    return <div className={finalClasses.get('root')}>{props.children}</div>;
};

export default ButtonGroup;

ButtonGroup.defaultProps = {
    vertical: false
};

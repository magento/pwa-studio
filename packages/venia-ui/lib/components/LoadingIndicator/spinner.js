import React from 'react';

import defaultClasses from './spinner.module.css';
import { useStyle } from '../../classify';
import { RotateCw as LoaderIcon } from 'react-feather';
import Icon from '../Icon';

const Spinner = props => {
    const classes = useStyle(defaultClasses, props.classes);

    return (
        <Icon
            src={LoaderIcon}
            size={24}
            classes={{ root: classes.root, icon: classes.icon }}
        />
    );
};

export default Spinner;

import React from 'react';
import { PlusSquare } from 'react-feather';

import defaultClasses from './createWishlist.css';
import { mergeClasses } from '../../classify';
import Icon from '../Icon';

const CreateWishlist = props => {
    const classes = mergeClasses(defaultClasses, props.classes);
    const createIcon = (
        <Icon classes={{ icon: classes.icon }} src={PlusSquare} />
    );

    return (
        <button>
            <div className={classes.labelContainer}>
                {createIcon}
                <span>Create a list</span>
            </div>
        </button>
    );
};

export default CreateWishlist;

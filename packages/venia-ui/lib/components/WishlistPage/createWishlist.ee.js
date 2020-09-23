import React from 'react';
import { FormattedMessage } from 'react-intl';
import { PlusSquare } from 'react-feather';

import defaultClasses from './createWishlist.css';
import { mergeClasses } from '../../classify';
import Icon from '../Icon';

const CreateWishlist = props => {
    const classes = mergeClasses(defaultClasses, props.classes);
    const createIcon = (
        <Icon
            classes={{
                icon: classes.icon
            }}
            src={PlusSquare}
        />
    );
    return (
        <button>
            <div className={classes.labelContainer}>
                {createIcon}
                <span>
                    <FormattedMessage
                        id={'createWishlist.createListText'}
                        defaultMessage={'Create a list'}
                    />
                </span>
            </div>
        </button>
    );
};

export default CreateWishlist;

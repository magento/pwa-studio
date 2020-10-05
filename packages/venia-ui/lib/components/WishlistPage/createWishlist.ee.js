import React, { useState, Fragment } from 'react';
import { FormattedMessage } from 'react-intl';
import { PlusSquare, X as CloseIcon } from 'react-feather';

import Icon from '../Icon';
import { Portal } from '../Portal';
import { mergeClasses } from '../../classify';

import defaultClasses from './createWishlist.css';

const CreateWishlist = props => {
    const classes = mergeClasses(defaultClasses, props.classes);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const createIcon = (
        <Icon
            classes={{
                icon: classes.icon
            }}
            src={PlusSquare}
        />
    );

    const creteModal = isCreateModalOpen ? (
        <Portal>
            <aside className={classes.modal}>
                <div className={classes.header}>
                    <span className={classes.header_text}>Create List</span>
                    <button
                        className={classes.close_button}
                        onClick={() => setIsCreateModalOpen(false)}
                    >
                        <Icon src={CloseIcon} />
                    </button>
                </div>
                <div>Create List</div>
            </aside>
        </Portal>
    ) : null;

    return (
        <Fragment>
            <button onClick={() => setIsCreateModalOpen(true)}>
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
            {creteModal}
        </Fragment>
    );
};

export default CreateWishlist;

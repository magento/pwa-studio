import React, { Fragment } from 'react';
import { FormattedMessage } from 'react-intl';
import { PlusSquare, X as CloseIcon } from 'react-feather';

import { useCreateWishlist } from '@magento/peregrine/lib/talons/WishlistPage/useCreateWishlist';

import Icon from '../Icon';
import { Portal } from '../Portal';
import { mergeClasses } from '../../classify';

import defaultClasses from './createWishlist.css';

const CreateWishlist = props => {
    const classes = mergeClasses(defaultClasses, props.classes);

    const { isModalOpen, hideModal, showModal } = useCreateWishlist();

    const modalClassName = isModalOpen ? classes.modal_open : classes.modal;

    const createIcon = (
        <Icon
            classes={{
                icon: classes.icon
            }}
            src={PlusSquare}
        />
    );

    const creteModalContents = isModalOpen ? (
        <Fragment>
            <div className={classes.header}>
                <span className={classes.header_text}>Create List</span>
                <button className={classes.close_button} onClick={hideModal}>
                    <Icon src={CloseIcon} />
                </button>
            </div>
            <div className={classes.body}>Create List</div>
        </Fragment>
    ) : null;

    return (
        <div className={classes.root}>
            <button className={classes.createButton} onClick={showModal}>
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
            <Portal>
                <aside className={modalClassName}>{creteModalContents}</aside>
            </Portal>
        </div>
    );
};

export default CreateWishlist;

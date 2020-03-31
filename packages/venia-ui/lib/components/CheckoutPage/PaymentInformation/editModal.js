import React, { useState } from 'react';
import { X as CloseIcon } from 'react-feather';

import Icon from '../../Icon';
import { Modal } from '../../Modal';
import { mergeClasses } from '../../../classify';

import defaultClasses from './editModal.css';

const EditModal = props => {
    const { classes: propClasses } = props;
    const [isOpen, setIsOpen] = useState(true);

    const classes = mergeClasses(defaultClasses, propClasses);
    const rootClass = isOpen ? classes.root_open : classes.root;

    return (
        <Modal>
            <aside className={rootClass}>
                <div className={classes.header}>
                    <span className={classes.headerText}>
                        Edit Payment Information
                    </span>
                    <button
                        className={classes.closeButton}
                        onClick={() => setIsOpen(false)}
                    >
                        <Icon src={CloseIcon} />
                    </button>
                </div>
                <div className={classes.body} />
            </aside>
        </Modal>
    );
};

export default EditModal;

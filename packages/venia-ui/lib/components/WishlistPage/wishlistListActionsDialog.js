import React from 'react';
import { bool, func, shape, string } from 'prop-types';
import { ChevronRight, Edit2 } from 'react-feather';
import { FormattedMessage, useIntl } from 'react-intl';

import { useStyle } from '../../classify';
import Dialog from '../Dialog';
import Icon from '../Icon';
import defaultClasses from './wishlistMoreActionsDialog.module.css';

const WishlistListActionsDialog = props => {
    const { isOpen, onCancel, onEdit } = props;

    const { formatMessage } = useIntl();

    const classes = useStyle(defaultClasses, props.classes);

    const dialogTitle = formatMessage({
        id: 'wishlistListActionsDialog.title_initial',
        defaultMessage: 'List Actions'
    });

    return (
        <Dialog
            isOpen={isOpen}
            onCancel={onCancel}
            shouldShowButtons={false}
            shouldUnmountOnHide={false}
            title={dialogTitle}
        >
            <div className={classes.root}>
                <button className={classes.rowButton} onClick={onEdit}>
                    <span className={classes.row}>
                        <Icon size={16} src={Edit2} />
                        <span className={classes.text}>
                            <FormattedMessage
                                id={'wishlistListActionsDialog.edit'}
                                defaultMessage={'Edit List'}
                            />
                        </span>
                        <Icon size={16} src={ChevronRight} />
                    </span>
                </button>
            </div>
        </Dialog>
    );
};

export default WishlistListActionsDialog;

WishlistListActionsDialog.propTypes = {
    classes: shape({
        root: string,
        rowButton: string,
        row: string,
        text: string
    }),
    isOpen: bool,
    onCancel: func,
    onEdit: func
};

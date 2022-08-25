import React from 'react';
import { bool, func, shape, string } from 'prop-types';
import { ChevronRight, Copy, Move, Trash2 } from 'react-feather';
import { FormattedMessage, useIntl } from 'react-intl';

import { useStyle } from '../../classify';
import Dialog from '../Dialog';
import Icon from '../Icon';
import defaultClasses from './wishlistMoreActionsDialog.module.css';

const WishlistMoreActionsDialog = props => {
    const { isOpen, onCancel, onRemove } = props;

    const { formatMessage } = useIntl();

    const classes = useStyle(defaultClasses, props.classes);

    const dialogTitle = formatMessage({
        id: 'wishlistMoreActionsDialog.title_initial',
        defaultMessage: 'Actions'
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
                <button className={classes.rowButton}>
                    <span className={classes.row}>
                        <Icon size={16} src={Move} />
                        <span className={classes.text}>
                            <FormattedMessage
                                id={'wishlistMoreActionsDialog.move'}
                                defaultMessage={'Move to'}
                            />
                        </span>
                        <Icon size={16} src={ChevronRight} />
                    </span>
                </button>
                <button className={classes.rowButton}>
                    <span className={classes.row}>
                        <Icon size={16} src={Copy} />
                        <span className={classes.text}>
                            <FormattedMessage
                                id={'wishlistMoreActionsDialog.copy'}
                                defaultMessage={'Copy to'}
                            />
                        </span>
                        <Icon size={16} src={ChevronRight} />
                    </span>
                </button>
                <button className={classes.rowButton} onClick={onRemove}>
                    <span className={classes.row}>
                        <Icon size={16} src={Trash2} />
                        <span className={classes.text}>
                            <FormattedMessage
                                id={'wishlistMoreActionsDialog.delete'}
                                defaultMessage={'Remove'}
                            />
                        </span>
                    </span>
                </button>
            </div>
        </Dialog>
    );
};

export default WishlistMoreActionsDialog;

WishlistMoreActionsDialog.propTypes = {
    classes: shape({
        root: string,
        rowButton: string,
        row: string,
        text: string
    }),
    isOpen: bool,
    onCancel: func,
    onRemove: func
};

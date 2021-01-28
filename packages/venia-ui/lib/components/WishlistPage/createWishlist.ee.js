import React from 'react';
import { shape, string } from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { PlusSquare } from 'react-feather';

import { useCreateWishlist } from '@magento/peregrine/lib/talons/WishlistPage/useCreateWishlist';

import Dialog from '../Dialog';
import Field from '../Field';
import Icon from '../Icon';
import { isRequired } from '../../util/formValidators';
import { mergeClasses } from '../../classify';
import RadioGroup from '../RadioGroup';
import TextInput from '../TextInput';

import defaultClasses from './createWishlist.css';

const CreateWishlist = props => {
    const classes = mergeClasses(defaultClasses, props.classes);

    const talonProps = useCreateWishlist();
    const {
        handleCreateList,
        handleHideModal,
        handleShowModal,
        isModalOpen
    } = talonProps;

    const { formatMessage } = useIntl();

    const createIcon = (
        <Icon
            classes={{
                icon: classes.icon
            }}
            src={PlusSquare}
        />
    );

    const radioGroupClasses = {
        message: classes.radioMessage,
        radioLabel: classes.radioLabel,
        root: classes.radioRoot
    };

    const radioGroupItems = [
        {
            label: formatMessage({
                id: 'global.private',
                defaultMessage: 'Private'
            }),
            value: 'private'
        },
        {
            label: formatMessage({
                id: 'global.public',
                defaultMessage: 'Public'
            }),
            value: 'public'
        }
    ];

    return (
        <div className={classes.root}>
            <button
                className={classes.createButton}
                onClick={handleShowModal}
                type="button"
            >
                <div className={classes.labelContainer}>
                    {createIcon}
                    <span>
                        <FormattedMessage
                            id={'createWishlist.handleCreateListText'}
                            defaultMessage={'Create a list'}
                        />
                    </span>
                </div>
            </button>
            <Dialog
                classes={{
                    body: classes.body,
                    buttons: classes.buttons,
                    cancelButton: classes.cancelButton,
                    confirmButton: classes.confirmButton,
                    contents: classes.contents
                }}
                cancelText={formatMessage({
                    id: 'global.cancelButton',
                    defaultMessage: 'Cancel'
                })}
                confirmText={formatMessage({
                    id: 'global.save',
                    defaultMessage: 'Save'
                })}
                formProps={{ initialValues: { sharing_code: 'private' } }}
                isModal={true}
                isOpen={isModalOpen}
                onCancel={handleHideModal}
                onConfirm={handleCreateList}
                shouldUnmountOnHide={false}
                title={formatMessage({
                    id: 'createWishlist.dialogTitle',
                    defaultMessage: 'New Favorites List'
                })}
            >
                <div className={classes.form}>
                    <Field
                        classes={{ root: classes.listName }}
                        label={formatMessage({
                            id: 'createWishlist.listName',
                            defaultMessage: 'List Name'
                        })}
                    >
                        <TextInput
                            field="name"
                            validate={isRequired}
                            validateOnBlur
                        />
                    </Field>
                    <RadioGroup
                        classes={radioGroupClasses}
                        field="sharing_code"
                        items={radioGroupItems}
                    />
                </div>
            </Dialog>
        </div>
    );
};

export default CreateWishlist;

CreateWishlist.propTypes = {
    classes: shape({
        body: string,
        buttons: string,
        createButton: string,
        icon: string,
        labelContainer: string,
        listName: string,
        radioLabel: string,
        radioMessage: string,
        radioRoot: string,
        root: string
    })
};

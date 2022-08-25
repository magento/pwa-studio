import React from 'react';
import { shape, string } from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { PlusSquare } from 'react-feather';

import { useCreateWishlist } from '@magento/peregrine/lib/talons/WishlistPage/useCreateWishlist';

import Dialog from '../Dialog';
import Field from '../Field';
import Icon from '../Icon';
import { isRequired } from '../../util/formValidators';
import { useStyle } from '../../classify';

import TextInput from '../TextInput';
import FormError from '../FormError/formError';

import defaultClasses from './createWishlist.module.css';

const CreateWishlist = props => {
    const { numberOfWishlists } = props;

    const classes = useStyle(defaultClasses, props.classes);

    const talonProps = useCreateWishlist({ numberOfWishlists });
    const {
        handleCreateList,
        handleHideModal,
        handleShowModal,
        isModalOpen,
        formErrors,
        loading,
        shouldRender
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

    return shouldRender ? (
        <div className={classes.root}>
            <button
                className={classes.createButton}
                onClick={handleShowModal}
                type="button"
                data-cy="createWishlist-createButton"
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
                formProps={{ initialValues: { visibility: 'PRIVATE' } }}
                isModal={true}
                isOpen={isModalOpen}
                onCancel={handleHideModal}
                onConfirm={handleCreateList}
                shouldUnmountOnHide={true}
                title={formatMessage({
                    id: 'createWishlist.dialogTitle',
                    defaultMessage: 'New Favorites List'
                })}
                shouldDisableConfirmButton={loading}
            >
                <div className={classes.form}>
                    <FormError errors={Array.from(formErrors.values())} />
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
                            data-cy="createWishlist-name"
                        />
                    </Field>
                </div>
            </Dialog>
        </div>
    ) : null;
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

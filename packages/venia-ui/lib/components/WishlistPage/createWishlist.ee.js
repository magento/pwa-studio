import React from 'react';
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

    const {
        createList,
        isModalOpen,
        hideModal,
        showModal
    } = useCreateWishlist();

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

    return (
        <div className={classes.root}>
            <button
                className={classes.createButton}
                onClick={showModal}
                type="button"
            >
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
            <Dialog
                classes={{ buttons: classes.buttons }}
                cancelText={formatMessage({
                    id: 'createWishlist.cancel',
                    defaultMessage: 'Cancel'
                })}
                confirmText={formatMessage({
                    id: 'createWishlist.save',
                    defaultMessage: 'Save'
                })}
                formProps={{ initialValues: { listtype: 'private' } }}
                isModal={true}
                isOpen={isModalOpen}
                onCancel={hideModal}
                onConfirm={createList}
                title={formatMessage({
                    id: 'createWishlist.dialogTitle',
                    defaultMessage: 'New Favorites List'
                })}
            >
                <div className={classes.body}>
                    <Field
                        classes={{ root: classes.listName }}
                        label={formatMessage({
                            id: 'createWishlist.listName',
                            defaultMessage: 'List Name'
                        })}
                    >
                        <TextInput
                            field="listname"
                            validate={isRequired}
                            validateOnBlur
                        />
                    </Field>
                    <RadioGroup
                        classes={radioGroupClasses}
                        field="listtype"
                        items={[
                            {
                                label: formatMessage({
                                    id: 'createWishlist.public',
                                    defaultMessage: 'Public'
                                }),
                                value: 'public'
                            },
                            {
                                label: formatMessage({
                                    id: 'createWishlist.private',
                                    defaultMessage: 'Private'
                                }),
                                value: 'private'
                            }
                        ]}
                    />
                </div>
            </Dialog>
        </div>
    );
};

export default CreateWishlist;

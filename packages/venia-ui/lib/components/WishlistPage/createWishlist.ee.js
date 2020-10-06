import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { PlusSquare, X as CloseIcon } from 'react-feather';
import { Form } from 'informed';

import { useCreateWishlist } from '@magento/peregrine/lib/talons/WishlistPage/useCreateWishlist';

import Button from '../Button';
import Field from '../Field';
import Icon from '../Icon';
import { isRequired } from '../../util/formValidators';
import { Portal } from '../Portal';
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

    const modalClassName = isModalOpen ? classes.modal_open : classes.modal;

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

    const creteModalContents = isModalOpen ? (
        <Form onSubmit={createList} initialValues={{ listtype: 'private' }}>
            <div className={classes.header}>
                <span className={classes.header_text}>New Favorites List</span>
                <button
                    className={classes.close_button}
                    onClick={hideModal}
                    type="button"
                >
                    <Icon src={CloseIcon} />
                </button>
            </div>
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
                <Button
                    className={classes.cancelButton}
                    onClick={hideModal}
                    type="button"
                >
                    <FormattedMessage
                        id={'createWishlist.cancel'}
                        defaultMessage={'Cancel'}
                    />
                </Button>
                <Button
                    className={classes.submitButton}
                    type="submit"
                    priority="high"
                >
                    <FormattedMessage
                        id={'createWishlist.save'}
                        defaultMessage={'Save'}
                    />
                </Button>
            </div>
        </Form>
    ) : null;

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
            <Portal>
                <aside className={modalClassName}>{creteModalContents}</aside>
            </Portal>
        </div>
    );
};

export default CreateWishlist;

import React from 'react';
import { FormattedMessage } from 'react-intl';
import { bool, func, shape, string, object, node } from 'prop-types';
import { Form } from 'informed';
import { X as CloseIcon } from 'react-feather';

import { useScrollLock } from '@magento/peregrine';
import { useStyle } from '@magento/venia-ui/lib/classify';

import Button from '../Button';
import Icon from '../Icon';
import { Portal } from '../Portal';
import defaultClasses from './dialog.module.css';

/**
 * The Dialog component shows its children content in a dialog,
 * encoding the look-and-feel and behavior in one place for consistency across the app.
 *
 * @typedef Dialog
 * @kind functional component
 *
 * @param {Object}  props
 * @param {Object}  props.classes - A set of class overrides to apply to elements.
 * @param {String}  props.cancelText - The text to display on the Dialog cancel button.
 * @param {String}  props.cancelTranslationId - The id to assign for the cancel button translation.
 * @param {String}  props.confirmText - The text to display on the Dialog confirm button.
 * @param {String}  props.confirmTranslationId - The id to assign for the confirm button translation.
 * @param {Object}  props.formProps - Props to apply to the internal form. @see https://joepuzzo.github.io/informed/?path=/story/form--props.
 * @param {Boolean} props.isModal - Determines behavior of clicking on the mask. False cancels Dialog.
 * @param {Boolean} props.isOpen - Whether the Dialog is currently showing.
 * @param {Func}    props.onCancel - A function to call when the user cancels the Dialog.
 * @param {Func}    props.onConfirm - A function to call when the user confirms the Dialog.
 * @param {Boolean} props.shouldDisableAllButtons - A toggle for whether the buttons should be disabled.
 * @param {Boolean} props.shouldDisableConfirmButton - A toggle for whether the confirm button should be disabled.
 *                                                     The final value is OR'ed with shouldDisableAllButtons.
 * @param {Boolean} props.shouldShowButtons - A toggle for whether the cancel and confirm buttons are visible.
 * @param {Boolean} props.shouldUnmountOnHide - A boolean to unmount child components on hide
 * @param {String}  props.title - The title of the Dialog.
 */
const Dialog = props => {
    const {
        cancelText,
        cancelTranslationId,
        children,
        confirmText,
        confirmTranslationId,
        formProps,
        isModal,
        isOpen,
        onCancel,
        onConfirm,
        shouldDisableAllButtons,
        shouldDisableConfirmButton,
        shouldShowButtons = true,
        shouldUnmountOnHide,
        title
    } = props;

    // Prevent the page from scrolling in the background
    // when the Dialog is open.
    useScrollLock(isOpen);

    const classes = useStyle(defaultClasses, props.classes);
    const rootClass = isOpen ? classes.root_open : classes.root;
    const isMaskDisabled = shouldDisableAllButtons || isModal;
    const confirmButtonDisabled =
        shouldDisableAllButtons || shouldDisableConfirmButton;

    const cancelButtonClasses = {
        root_lowPriority: classes.cancelButton
    };
    const confirmButtonClasses = {
        root_highPriority: classes.confirmButton
    };

    const maybeCloseXButton = !isModal ? (
        <button
            className={classes.headerButton}
            disabled={shouldDisableAllButtons}
            onClick={onCancel}
            type="reset"
        >
            <Icon src={CloseIcon} />
        </button>
    ) : null;

    const maybeButtons = shouldShowButtons ? (
        <div className={classes.buttons}>
            <Button
                data-cy="Dialog-cancelButton"
                classes={cancelButtonClasses}
                disabled={shouldDisableAllButtons}
                onClick={onCancel}
                priority="low"
                type="reset"
            >
                <FormattedMessage
                    id={cancelTranslationId}
                    defaultMessage={cancelText}
                />
            </Button>
            <Button
                data-cy="Dialog-confirmButton"
                classes={confirmButtonClasses}
                disabled={confirmButtonDisabled}
                priority="high"
                type="submit"
            >
                <FormattedMessage
                    id={confirmTranslationId}
                    defaultMessage={confirmText}
                />
            </Button>
        </div>
    ) : null;

    const maybeForm =
        isOpen || !shouldUnmountOnHide ? (
            <Form
                className={classes.form}
                {...formProps}
                onSubmit={onConfirm}
                data-cy="Dialog-form"
            >
                {/* The Mask. */}
                <button
                    className={classes.mask}
                    disabled={isMaskDisabled}
                    onClick={onCancel}
                    type="reset"
                />
                {/* The Dialog. */}
                <div className={classes.dialog} data-cy={title}>
                    <div className={classes.header}>
                        <span
                            className={classes.headerText}
                            data-cy="Dialog-headerText"
                        >
                            {title}
                        </span>
                        {maybeCloseXButton}
                    </div>
                    <div className={classes.body}>
                        <div className={classes.contents}>{children}</div>
                        {maybeButtons}
                    </div>
                </div>
            </Form>
        ) : null;

    return (
        <Portal>
            <aside className={rootClass} data-cy="Dialog-root">
                {maybeForm}
            </aside>
        </Portal>
    );
};

export default Dialog;

Dialog.propTypes = {
    cancelText: string,
    cancelTranslationId: string,
    classes: shape({
        body: string,
        cancelButton: string,
        confirmButton: string,
        container: string,
        contents: string,
        header: string,
        headerText: string,
        headerButton: string,
        mask: string,
        root: string,
        root_open: string
    }),
    confirmText: string,
    confirmTranslationId: string,
    formProps: object,
    isModal: bool,
    isOpen: bool,
    onCancel: func,
    onConfirm: func,
    shouldDisableAllButtons: bool,
    shouldDisableSubmitButton: bool,
    shouldUnmountOnHide: bool,
    title: node
};

Dialog.defaultProps = {
    cancelText: 'Cancel',
    cancelTranslationId: 'global.cancelButton',
    confirmText: 'Confirm',
    confirmTranslationId: 'global.confirmButton',
    isModal: false,
    shouldUnmountOnHide: true
};

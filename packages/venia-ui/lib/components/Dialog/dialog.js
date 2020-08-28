import React from 'react';
import { bool, func, shape, string, object } from 'prop-types';
import { Form } from 'informed';
import { X as CloseIcon } from 'react-feather';

import { useScrollLock } from '@magento/peregrine';
import { mergeClasses } from '@magento/venia-ui/lib/classify';

import Button from '../Button';
import Icon from '../Icon';
import { Portal } from '../Portal';
import defaultClasses from './dialog.css';

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
 * @param {String}  props.confirmText - The text to display on the Dialog confirm button.
 * @param {Object}  props.formProps - Props to apply to the internal form. @see https://joepuzzo.github.io/informed/?path=/story/form--props.
 * @param {Boolean} props.isModal - Determines behavior of clicking on the mask. False cancels Dialog.
 * @param {Boolean} props.isOpen - Whether the Dialog is currently showing.
 * @param {Func}    props.onCancel - A function to call when the user cancels the Dialog.
 * @param {Func}    props.onConfirm - A function to call when the user confirms the Dialog.
 * @param {Boolean} props.shouldDisableAllButtons - A toggle for whether the buttons should be disabled.
 * @param {Boolean} props.shouldDisableConfirmButton - A toggle for whether the confirm button should be disabled.
 *                                                     The final value is OR'ed with shouldDisableAllButtons.
 * @param {String}  props.title - The title of the Dialog.
 */
const Dialog = props => {
    const {
        cancelText,
        children,
        confirmText,
        formProps,
        isModal,
        isOpen,
        onCancel,
        onConfirm,
        shouldDisableAllButtons,
        shouldDisableConfirmButton,
        title
    } = props;

    // Prevent the page from scrolling in the background
    // when the Dialog is open.
    useScrollLock(isOpen);

    const classes = mergeClasses(defaultClasses, props.classes);
    const rootClass = isOpen ? classes.root_open : classes.root;
    const isMaskDisabled = shouldDisableAllButtons || isModal;
    const confirmButtonDisabled =
        shouldDisableAllButtons || shouldDisableConfirmButton;

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

    return (
        <Portal>
            <aside className={rootClass}>
                <Form
                    className={classes.form}
                    {...formProps}
                    onSubmit={onConfirm}
                >
                    {/* The Mask. */}
                    <button
                        className={classes.mask}
                        disabled={isMaskDisabled}
                        onClick={onCancel}
                        type="reset"
                    />

                    {/* The Dialog. */}
                    <div className={classes.dialog}>
                        <div className={classes.header}>
                            <span className={classes.headerText}>{title}</span>
                            {maybeCloseXButton}
                        </div>
                        <div className={classes.body}>
                            <div className={classes.contents}>{children}</div>
                            <div className={classes.buttons}>
                                <Button
                                    disabled={shouldDisableAllButtons}
                                    onClick={onCancel}
                                    priority="low"
                                    type="reset"
                                >
                                    {cancelText}
                                </Button>
                                <Button
                                    classes={confirmButtonClasses}
                                    disabled={confirmButtonDisabled}
                                    priority="high"
                                    type="submit"
                                >
                                    {confirmText}
                                </Button>
                            </div>
                        </div>
                    </div>
                </Form>
            </aside>
        </Portal>
    );
};

export default Dialog;

Dialog.propTypes = {
    cancelText: string,
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
    formProps: object,
    isModal: bool,
    isOpen: bool,
    onCancel: func,
    onConfirm: func,
    shouldDisableAllButtons: bool,
    shouldDisableSubmitButton: bool,
    title: string
};

Dialog.defaultProps = {
    cancelText: 'Cancel',
    confirmText: 'Confirm',
    isModal: false
};

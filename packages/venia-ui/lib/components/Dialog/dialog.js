import React from 'react';
import { bool, func, shape, string, object } from 'prop-types';
import { Form } from 'informed';
import { X as CloseIcon } from 'react-feather';

import { mergeClasses } from '@magento/venia-ui/lib/classify';

import Icon from '../Icon';
import { Modal } from '../Modal';
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
 * @param {Boolean} props.shouldDisableButtons - A toggle for whether the buttons should be disabled.
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
        shouldDisableButtons,
        title
    } = props;

    const classes = mergeClasses(defaultClasses, props.classes);
    const maskClass = isOpen ? classes.mask_open : classes.mask;
    const rootClass = isOpen ? classes.root_open : classes.root;
    const isMaskDisabled = shouldDisableButtons || isModal;

    return (
        <Modal>
            {/* The Mask. */}
            <button
                className={maskClass}
                disabled={isMaskDisabled}
                onClick={onCancel}
                type="button"
            />
            {/* The Dialog. */}
            <aside className={rootClass}>
                <Form
                    {...formProps}
                    className={classes.container}
                    onSubmit={onConfirm}
                >
                    <div className={classes.header}>
                        <span className={classes.headerText}>{title}</span>
                        <button
                            className={classes.headerButton}
                            disabled={shouldDisableButtons}
                            onClick={onCancel}
                            type="reset"
                        >
                            <Icon src={CloseIcon} />
                        </button>
                    </div>
                    <div className={classes.body}>
                        <div className={classes.contents}>{children}</div>
                        <div className={classes.buttons}>
                            <button
                                className={classes.cancelButton}
                                disabled={shouldDisableButtons}
                                onClick={onCancel}
                                type="reset"
                            >
                                {cancelText}
                            </button>
                            <button
                                className={classes.confirmButton}
                                disabled={shouldDisableButtons}
                                type="submit"
                            >
                                {confirmText}
                            </button>
                        </div>
                    </div>
                </Form>
            </aside>
        </Modal>
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
    shouldDisableButtons: bool,
    title: string
};

Dialog.defaultProps = {
    cancelText: 'Cancel',
    confirmText: 'Confirm',
    isModal: false
};

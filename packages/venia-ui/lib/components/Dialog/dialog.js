import React, { useMemo } from 'react';
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
 * @param {Func}    props.onCancel - A function to call when the user cancels the Dialog.
 * @param {Func}    props.onConfirm - A function to call when the user confirms the Dialog.
 * @param {Object}  props.initialFormValues - Optional initial values to seed the internal form.
 * @param {Boolean} props.isModal - Determines behavior of clicking outside the content area. False cancels Dialog.
 * @param {Boolean} props.isOpen - Whether the Dialog is currently showing.
 * @param {String}  props.title - The title of the Dialog.
 */
const Dialog = props => {
    const {
        cancelText,
        children,
        confirmText,
        onCancel,
        onConfirm,
        initialFormValues,
        isModal,
        isOpen,
        title,
    } = props;

    const classes = mergeClasses(defaultClasses, props.classes);
    const rootClass = isOpen ? classes.root_open : classes.root;
    const maskElement = useMemo(() => {
        if (isModal) {
            // In Modal mode, the mask is not clickable.
            return <div className={classes.mask} />;
        }

        return (
            <button
                className={classes.mask}
                onClick={onCancel}
                type="reset"
            ></button>
        )
    }, [classes.mask, isModal, onCancel]);

    return (
        <Modal>
            <Form className={classes.container} initialValues={initialFormValues} onSubmit={onConfirm}>
                {maskElement}
                <aside className={rootClass}>
                    <div className={classes.container}>
                        <div className={classes.header}>
                            <span className={classes.headerText}>
                                {title}
                            </span>
                            <button
                                className={classes.headerButton}
                                onClick={onCancel}
                                type="reset"
                            >
                                <Icon src={CloseIcon} />
                            </button>
                        </div>
                        <div className={classes.body}>
                            <div className={classes.contents}>
                                {children}
                            </div>
                            <div className={classes.buttons}>
                                <button
                                    className={classes.cancelButton}
                                    onClick={onCancel}
                                    type="reset"
                                >
                                    {cancelText}
                                </button>
                                <button
                                    className={classes.confirmButton}
                                    type="submit"
                                >
                                    {confirmText}
                                </button>
                            </div>
                        </div>
                    </div>
                </aside>
            </Form>
        </Modal>
    );
};

export default Dialog;

Dialog.propTypes = {
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
        root_open: string,
    }),
    cancelText: string,
    confirmText: string,
    onCancel: func,
    onConfirm: func,
    initialFormValues: object,
    isModal: bool,
    isOpen: bool,
    title: string
};

Dialog.defaultProps = {
    cancelText: 'Cancel',
    confirmText: 'Confirm',
    isModal: false
};

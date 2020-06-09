export default Dialog;
/**
 * The Dialog component shows its children content in a dialog,
 * encoding the look-and-feel and behavior in one place for consistency across the app.
 */
export type Dialog = any;
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
declare function Dialog(props: {
    classes: any;
    cancelText: string;
    confirmText: string;
    formProps: any;
}): JSX.Element;
declare namespace Dialog {
    export namespace propTypes {
        export { string as cancelText };
        export const classes: import("prop-types").Requireable<import("prop-types").InferProps<{
            body: import("prop-types").Requireable<string>;
            cancelButton: import("prop-types").Requireable<string>;
            confirmButton: import("prop-types").Requireable<string>;
            container: import("prop-types").Requireable<string>;
            contents: import("prop-types").Requireable<string>;
            header: import("prop-types").Requireable<string>;
            headerText: import("prop-types").Requireable<string>;
            headerButton: import("prop-types").Requireable<string>;
            mask: import("prop-types").Requireable<string>;
            root: import("prop-types").Requireable<string>;
            root_open: import("prop-types").Requireable<string>;
        }>>;
        export { string as confirmText };
        export { object as formProps };
        export { bool as isModal };
        export { bool as isOpen };
        export { func as onCancel };
        export { func as onConfirm };
        export { bool as shouldDisableAllButtons };
        export { bool as shouldDisableSubmitButton };
        export { string as title };
    }
    export namespace defaultProps {
        export const cancelText: string;
        export const confirmText: string;
        export const isModal: boolean;
    }
}
import { string } from "prop-types";
import { object } from "prop-types";
import { bool } from "prop-types";
import { func } from "prop-types";

export default Toast;
declare function Toast(props: any): JSX.Element;
declare namespace Toast {
    export const propTypes: {
        actionText: import("prop-types").Requireable<string>;
        dismissable: import("prop-types").Requireable<boolean>;
        icon: import("prop-types").Requireable<object>;
        id: import("prop-types").Requireable<number>;
        message: import("prop-types").Validator<string>;
        onAction: import("prop-types").Requireable<(...args: any[]) => any>;
        onDismiss: import("prop-types").Requireable<(...args: any[]) => any>;
        handleAction: import("prop-types").Requireable<(...args: any[]) => any>;
        handleDismiss: import("prop-types").Requireable<(...args: any[]) => any>;
        type: import("prop-types").Validator<string>;
    };
}

export default EditModal;
declare function EditModal(props: any): JSX.Element;
declare namespace EditModal {
    export namespace propTypes {
        export const classes: import("prop-types").Requireable<import("prop-types").InferProps<{
            root: import("prop-types").Requireable<string>;
            root_open: import("prop-types").Requireable<string>;
            body: import("prop-types").Requireable<string>;
            header: import("prop-types").Requireable<string>;
            header_text: import("prop-types").Requireable<string>;
            actions_container: import("prop-types").Requireable<string>;
            cancel_button: import("prop-types").Requireable<string>;
            update_button: import("prop-types").Requireable<string>;
            close_button: import("prop-types").Requireable<string>;
        }>>;
        export const onClose: import("prop-types").Validator<(...args: any[]) => any>;
    }
}

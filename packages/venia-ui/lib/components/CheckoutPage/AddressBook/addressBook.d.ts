export default AddressBook;
declare function AddressBook(props: any): JSX.Element;
declare namespace AddressBook {
    export namespace propTypes {
        export const activeContent: import("prop-types").Validator<string>;
        export const classes: import("prop-types").Requireable<import("prop-types").InferProps<{
            root: import("prop-types").Requireable<string>;
            root_active: import("prop-types").Requireable<string>;
            headerText: import("prop-types").Requireable<string>;
            buttonContainer: import("prop-types").Requireable<string>;
            content: import("prop-types").Requireable<string>;
            addButton: import("prop-types").Requireable<string>;
        }>>;
        export const toggleActiveContent: import("prop-types").Validator<(...args: any[]) => any>;
    }
}

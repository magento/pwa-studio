export default ShippingInformation;
declare function ShippingInformation(props: any): JSX.Element;
declare namespace ShippingInformation {
    export namespace propTypes {
        export const classes: import("prop-types").Requireable<import("prop-types").InferProps<{
            root: import("prop-types").Requireable<string>;
            root_editMode: import("prop-types").Requireable<string>;
            cardHeader: import("prop-types").Requireable<string>;
            cartTitle: import("prop-types").Requireable<string>;
            editWrapper: import("prop-types").Requireable<string>;
            editTitle: import("prop-types").Requireable<string>;
        }>>;
        export const onSave: import("prop-types").Validator<(...args: any[]) => any>;
        export const toggleActiveContent: import("prop-types").Validator<(...args: any[]) => any>;
    }
}

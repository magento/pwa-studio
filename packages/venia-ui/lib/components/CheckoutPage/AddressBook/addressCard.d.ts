export default AddressCard;
declare function AddressCard(props: any): JSX.Element;
declare namespace AddressCard {
    export namespace propTypes {
        export const address: import("prop-types").Validator<import("prop-types").InferProps<{
            city: import("prop-types").Requireable<string>;
            country_code: import("prop-types").Requireable<string>;
            default_shipping: import("prop-types").Requireable<boolean>;
            firstname: import("prop-types").Requireable<string>;
            lastname: import("prop-types").Requireable<string>;
            postcode: import("prop-types").Requireable<string>;
            region: import("prop-types").Requireable<import("prop-types").InferProps<{
                region_code: import("prop-types").Requireable<string>;
                region: import("prop-types").Requireable<string>;
            }>>;
            street: import("prop-types").Requireable<string[]>;
        }>>;
        export const classes: import("prop-types").Requireable<import("prop-types").InferProps<{
            root: import("prop-types").Requireable<string>;
            root_selected: import("prop-types").Requireable<string>;
            root_updated: import("prop-types").Requireable<string>;
            editButton: import("prop-types").Requireable<string>;
            editIcon: import("prop-types").Requireable<string>;
            defaultBadge: import("prop-types").Requireable<string>;
            name: import("prop-types").Requireable<string>;
            address: import("prop-types").Requireable<string>;
        }>>;
        export const isSelected: import("prop-types").Validator<boolean>;
        export const onEdit: import("prop-types").Validator<(...args: any[]) => any>;
        export const onSelection: import("prop-types").Validator<(...args: any[]) => any>;
    }
}

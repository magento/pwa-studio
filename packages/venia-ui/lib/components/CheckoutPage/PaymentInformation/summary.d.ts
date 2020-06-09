export default Summary;
declare function Summary(props: any): JSX.Element;
declare namespace Summary {
    export namespace propTypes {
        export const classes: import("prop-types").Requireable<import("prop-types").InferProps<{
            root: import("prop-types").Requireable<string>;
            heading_container: import("prop-types").Requireable<string>;
            heading: import("prop-types").Requireable<string>;
            edit_button: import("prop-types").Requireable<string>;
            card_details_container: import("prop-types").Requireable<string>;
            address_summary_container: import("prop-types").Requireable<string>;
            first_name: import("prop-types").Requireable<string>;
            last_name: import("prop-types").Requireable<string>;
            street1: import("prop-types").Requireable<string>;
            street2: import("prop-types").Requireable<string>;
            city: import("prop-types").Requireable<string>;
            postalCode: import("prop-types").Requireable<string>;
            country: import("prop-types").Requireable<string>;
            payment_type: import("prop-types").Requireable<string>;
            payment_details: import("prop-types").Requireable<string>;
        }>>;
        export const onEdit: import("prop-types").Validator<(...args: any[]) => any>;
    }
}

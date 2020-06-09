export default FilterModal;
/**
 * A view that displays applicable and applied filters.
 *
 * @param {Object} props.filters - filters to display
 */
declare function FilterModal(props: any): JSX.Element;
declare namespace FilterModal {
    export namespace propTypes {
        export const classes: import("prop-types").Requireable<import("prop-types").InferProps<{
            blocks: import("prop-types").Requireable<string>;
            body: import("prop-types").Requireable<string>;
            header: import("prop-types").Requireable<string>;
            headerTitle: import("prop-types").Requireable<string>;
            root: import("prop-types").Requireable<string>;
            root_open: import("prop-types").Requireable<string>;
        }>>;
        export const filters: import("prop-types").Requireable<import("prop-types").InferProps<{
            attribute_code: import("prop-types").Requireable<string>;
            items: import("prop-types").Requireable<any[]>;
        }>[]>;
    }
}

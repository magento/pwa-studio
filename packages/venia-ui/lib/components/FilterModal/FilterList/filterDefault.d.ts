export default FilterDefault;
declare function FilterDefault(props: any): JSX.Element;
declare namespace FilterDefault {
    export namespace propTypes {
        export const classes: import("prop-types").Requireable<import("prop-types").InferProps<{
            root: import("prop-types").Requireable<string>;
            icon: import("prop-types").Requireable<string>;
        }>>;
        export { string as group };
        export { bool as isSelected };
        export const item: import("prop-types").Requireable<import("prop-types").InferProps<{
            label: import("prop-types").Requireable<string>;
        }>>;
        export { string as label };
    }
}
import { string } from "prop-types";
import { bool } from "prop-types";

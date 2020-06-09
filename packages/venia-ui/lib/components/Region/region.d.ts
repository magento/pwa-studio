export default Region;
/**
 * Form component for Region that is seeded with backend data.
 *
 * @param {string} props.optionValueKey - Key to use for returned option values. In a future release, this will be removed and hard-coded to use "id" once GraphQL has resolved MC-30886.
 */
declare function Region(props: any): JSX.Element;
declare namespace Region {
    export namespace defaultProps {
        export const field: string;
        export const label: string;
        export const optionValueKey: string;
    }
    export namespace propTypes {
        export const classes: import("prop-types").Requireable<import("prop-types").InferProps<{
            root: import("prop-types").Requireable<string>;
        }>>;
        export { string as field };
        export { string as label };
        export { string as optionValueKey };
        export { func as validate };
        export { string as initialValue };
    }
}
import { string } from "prop-types";
import { func } from "prop-types";

export default Country;
declare function Country(props: any): JSX.Element;
declare namespace Country {
    export namespace defaultProps {
        export const field: string;
        export const label: string;
    }
    export namespace propTypes {
        export const classes: import("prop-types").Requireable<import("prop-types").InferProps<{
            root: import("prop-types").Requireable<string>;
        }>>;
        export { string as field };
        export { string as label };
        export { func as validate };
        export { string as initialValue };
    }
}
import { string } from "prop-types";
import { func } from "prop-types";

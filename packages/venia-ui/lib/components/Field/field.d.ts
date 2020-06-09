export default Field;
declare function Field(props: any): JSX.Element;
declare namespace Field {
    export namespace propTypes {
        export { node as children };
        export const classes: import("prop-types").Requireable<import("prop-types").InferProps<{
            label: import("prop-types").Requireable<string>;
            root: import("prop-types").Requireable<string>;
        }>>;
        export { string as id };
        export { node as label };
        export { bool as required };
    }
}
import { node } from "prop-types";
import { string } from "prop-types";
import { bool } from "prop-types";

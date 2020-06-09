export default Section;
declare function Section(props: any): JSX.Element;
declare namespace Section {
    export namespace propTypes {
        export const classes: import("prop-types").Requireable<import("prop-types").InferProps<{
            content: import("prop-types").Requireable<string>;
            icon: import("prop-types").Requireable<string>;
            label: import("prop-types").Requireable<string>;
            root: import("prop-types").Requireable<string>;
            summary: import("prop-types").Requireable<string>;
        }>>;
        export { node as label };
        export { bool as showEditIcon };
    }
}
import { node } from "prop-types";
import { bool } from "prop-types";

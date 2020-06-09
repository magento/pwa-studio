export default Section;
declare function Section(props: any): JSX.Element;
declare namespace Section {
    export namespace propTypes {
        export const classes: import("prop-types").Requireable<import("prop-types").InferProps<{
            icon: import("prop-types").Requireable<string>;
            icon_filled: import("prop-types").Requireable<string>;
            menuItem: import("prop-types").Requireable<string>;
            text: import("prop-types").Requireable<string>;
        }>>;
        export const icon: import("prop-types").Requireable<string>;
        export { bool as isFilled };
        export { func as onClick };
        export { string as text };
    }
}
import { bool } from "prop-types";
import { func } from "prop-types";
import { string } from "prop-types";

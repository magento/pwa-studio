export default Kebab;
declare function Kebab(props: any): JSX.Element;
declare namespace Kebab {
    export namespace propTypes {
        export { node as children };
        export const classes: import("prop-types").Requireable<import("prop-types").InferProps<{
            dropdown: import("prop-types").Requireable<string>;
            dropdown_active: import("prop-types").Requireable<string>;
            kebab: import("prop-types").Requireable<string>;
            root: import("prop-types").Requireable<string>;
        }>>;
    }
}
import { node } from "prop-types";

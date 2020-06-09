export default Header;
declare function Header(props: any): JSX.Element;
declare namespace Header {
    export namespace propTypes {
        export const classes: import("prop-types").Requireable<import("prop-types").InferProps<{
            root: import("prop-types").Requireable<string>;
            title: import("prop-types").Requireable<string>;
        }>>;
        export { func as closeDrawer };
        export { bool as isEditingItem };
    }
}
import { func } from "prop-types";
import { bool } from "prop-types";

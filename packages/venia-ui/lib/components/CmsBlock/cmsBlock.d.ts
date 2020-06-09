export default CmsBlockGroup;
declare function CmsBlockGroup(props: any): JSX.Element;
declare namespace CmsBlockGroup {
    export namespace propTypes {
        export { func as children };
        export const classes: import("prop-types").Requireable<import("prop-types").InferProps<{
            block: import("prop-types").Requireable<string>;
            content: import("prop-types").Requireable<string>;
            root: import("prop-types").Requireable<string>;
        }>>;
        export const identifiers: import("prop-types").Requireable<string | any[]>;
    }
}
import { func } from "prop-types";

export default MiniCartMask;
declare function MiniCartMask(props: any): JSX.Element;
declare namespace MiniCartMask {
    export namespace propTypes {
        export const classes: import("prop-types").Requireable<import("prop-types").InferProps<{
            root_active: import("prop-types").Requireable<string>;
        }>>;
        export { func as dismiss };
        export { bool as isActive };
    }
}
import { func } from "prop-types";
import { bool } from "prop-types";

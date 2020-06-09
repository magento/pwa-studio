export default EmptyMiniCart;
declare function EmptyMiniCart(props: any): JSX.Element;
declare namespace EmptyMiniCart {
    export namespace propTypes {
        export const classes: import("prop-types").Requireable<import("prop-types").InferProps<{
            root: import("prop-types").Requireable<string>;
            emptyTitle: import("prop-types").Requireable<string>;
            continue: import("prop-types").Requireable<string>;
        }>>;
        export { func as closeDrawer };
    }
}
import { func } from "prop-types";

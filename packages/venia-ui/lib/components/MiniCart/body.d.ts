export default Body;
declare function Body(props: any): JSX.Element;
declare namespace Body {
    export namespace propTypes {
        export const beginEditItem: import("prop-types").Validator<(...args: any[]) => any>;
        export { array as cartItems };
        export const classes: import("prop-types").Requireable<import("prop-types").InferProps<{
            root: import("prop-types").Requireable<string>;
        }>>;
        export { func as closeDrawer };
        export { string as currencyCode };
        export { object as editItem };
        export { func as endEditItem };
        export { bool as isCartEmpty };
        export { bool as isEditingItem };
        export { bool as isLoading };
        export { bool as isUpdatingItem };
    }
}
import { array } from "prop-types";
import { func } from "prop-types";
import { string } from "prop-types";
import { object } from "prop-types";
import { bool } from "prop-types";

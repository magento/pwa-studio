export default Footer;
declare function Footer(props: any): JSX.Element;
declare namespace Footer {
    export namespace propTypes {
        export { object as cart };
        export const classes: import("prop-types").Requireable<import("prop-types").InferProps<{
            placeholderButton: import("prop-types").Requireable<string>;
            root: import("prop-types").Requireable<string>;
            root_open: import("prop-types").Requireable<string>;
            summary: import("prop-types").Requireable<string>;
        }>>;
        export { string as currencyCode };
        export { bool as isMiniCartMaskOpen };
        export { number as numItems };
        export { number as subtotal };
    }
}
import { object } from "prop-types";
import { string } from "prop-types";
import { bool } from "prop-types";
import { number } from "prop-types";

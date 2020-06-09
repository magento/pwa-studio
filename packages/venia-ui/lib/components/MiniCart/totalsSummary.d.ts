export default TotalsSummary;
declare function TotalsSummary(props: any): JSX.Element;
declare namespace TotalsSummary {
    export namespace propTypes {
        export const classes: import("prop-types").Requireable<import("prop-types").InferProps<{
            root: import("prop-types").Requireable<string>;
            subtotalLabel: import("prop-types").Requireable<string>;
            subtotalValue: import("prop-types").Requireable<string>;
            totals: import("prop-types").Requireable<string>;
        }>>;
        export { string as currencyCode };
        export { number as numItems };
        export { number as subtotal };
    }
}
import { string } from "prop-types";
import { number } from "prop-types";

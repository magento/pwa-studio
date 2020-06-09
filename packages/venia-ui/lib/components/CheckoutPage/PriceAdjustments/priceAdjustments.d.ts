export default PriceAdjustments;
/**
 * PriceAdjustments component for the Checkout page.

 * @param {Function} props.setPageIsUpdating callback that sets checkout page updating state
 */
declare function PriceAdjustments(props: any): JSX.Element;
declare namespace PriceAdjustments {
    export namespace propTypes {
        export { func as setPageIsUpdating };
    }
}
import { func } from "prop-types";

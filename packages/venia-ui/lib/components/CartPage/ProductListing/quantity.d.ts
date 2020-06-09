export function QuantityFields(props: any): JSX.Element;
export namespace QuantityFields {
    export namespace defaultProps {
        export const min: number;
        export const initialValue: number;
        export function onChange(): void;
    }
}
export default Quantity;
declare function Quantity(props: any): JSX.Element;
declare namespace Quantity {
    export namespace propTypes {
        export { number as initialValue };
        export { string as itemId };
        export { string as label };
        export { number as min };
        export { func as onChange };
    }
    export namespace defaultProps_1 {
        export const label: string;
        const min_1: number;
        export { min_1 as min };
        const initialValue_1: number;
        export { initialValue_1 as initialValue };
        export function onChange_1(): void;
        export { onChange_1 as onChange };
    }
    export { defaultProps_1 as defaultProps };
}
import { number } from "prop-types";
import { string } from "prop-types";
import { func } from "prop-types";

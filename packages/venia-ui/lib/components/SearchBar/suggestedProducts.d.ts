export default SuggestedProducts;
declare function SuggestedProducts(props: any): JSX.Element;
declare namespace SuggestedProducts {
    export namespace defaultProps {
        export const limit: number;
    }
    export namespace propTypes {
        export const classes: import("prop-types").Requireable<import("prop-types").InferProps<{
            item: import("prop-types").Requireable<string>;
            root: import("prop-types").Requireable<string>;
        }>>;
        const limit_1: import("prop-types").Validator<number>;
        export { limit_1 as limit };
        export { func as onNavigate };
        export const products: import("prop-types").Validator<import("prop-types").InferProps<{
            id: import("prop-types").Validator<string | number>;
        }>[]>;
    }
}
import { func } from "prop-types";

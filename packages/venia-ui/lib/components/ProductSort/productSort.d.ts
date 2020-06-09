export default ProductSort;
declare function ProductSort(props: any): JSX.Element;
declare namespace ProductSort {
    export namespace propTypes {
        export const availableSortMethods: import("prop-types").Requireable<import("prop-types").InferProps<{
            text: import("prop-types").Requireable<string>;
            attribute: import("prop-types").Requireable<string>;
            sortDirection: import("prop-types").Requireable<string>;
        }>[]>;
        export { array as sortProps };
    }
    export namespace defaultProps {
        const availableSortMethods_1: {
            text: string;
            attribute: string;
            sortDirection: string;
        }[];
        export { availableSortMethods_1 as availableSortMethods };
    }
}
import { array } from "prop-types";

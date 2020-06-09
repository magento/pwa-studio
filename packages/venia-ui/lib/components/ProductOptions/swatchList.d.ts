export default SwatchList;
declare function SwatchList(props: any): JSX.Element;
declare namespace SwatchList {
    export namespace propTypes {
        export const classes: import("prop-types").Requireable<import("prop-types").InferProps<{
            root: import("prop-types").Requireable<string>;
        }>>;
        export { func as getItemKey };
        export { object as selectedValue };
        export const items: import("prop-types").Requireable<object[]>;
        export { func as onSelectionChange };
    }
    export const displayName: string;
}
import { func } from "prop-types";
import { object } from "prop-types";

export default Options;
declare function Options(props: any): any;
declare namespace Options {
    export namespace propTypes {
        export { func as onSelectionChange };
        export const options: import("prop-types").Validator<any[]>;
        export { array as selectedValues };
    }
}
import { func } from "prop-types";
import { array } from "prop-types";

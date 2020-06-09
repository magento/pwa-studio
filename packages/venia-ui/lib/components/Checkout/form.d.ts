export default Form;
/**
 * The Form component is similar to Flow in that it renders either the overview
 * or the editable form based on the 'editing' state value.
 */
declare function Form(props: any): JSX.Element;
declare namespace Form {
    export namespace propTypes {
        export const classes: import("prop-types").Requireable<import("prop-types").InferProps<{
            root: import("prop-types").Requireable<string>;
        }>>;
        export { func as setStep };
    }
}
import { func } from "prop-types";

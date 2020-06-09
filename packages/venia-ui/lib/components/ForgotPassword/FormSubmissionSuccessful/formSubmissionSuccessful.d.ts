export default FormSubmissionSuccessful;
declare function FormSubmissionSuccessful(props: any): JSX.Element;
declare namespace FormSubmissionSuccessful {
    export namespace propTypes {
        export const classes: import("prop-types").Requireable<import("prop-types").InferProps<{
            buttonContainer: import("prop-types").Requireable<string>;
            root: import("prop-types").Requireable<string>;
            text: import("prop-types").Requireable<string>;
        }>>;
        export { string as email };
        export const onContinue: import("prop-types").Validator<(...args: any[]) => any>;
    }
}
import { string } from "prop-types";

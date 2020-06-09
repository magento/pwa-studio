export default App;
declare function App(props: any): JSX.Element;
declare namespace App {
    export namespace propTypes {
        export const markErrorHandled: import("prop-types").Validator<(...args: any[]) => any>;
        export const renderError: import("prop-types").Requireable<import("prop-types").InferProps<{
            stack: import("prop-types").Requireable<string>;
        }>>;
        export { array as unhandledErrors };
    }
}
import { array } from "prop-types";

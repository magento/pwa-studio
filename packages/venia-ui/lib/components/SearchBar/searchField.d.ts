export default SearchField;
declare function SearchField(props: any): JSX.Element;
declare namespace SearchField {
    export namespace propTypes {
        export { func as onChange };
        export { func as onFocus };
    }
}
import { func } from "prop-types";

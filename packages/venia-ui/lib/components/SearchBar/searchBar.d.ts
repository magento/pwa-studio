export default SearchBar;
declare function SearchBar(props: any): JSX.Element;
declare namespace SearchBar {
    export namespace propTypes {
        export const classes: import("prop-types").Requireable<import("prop-types").InferProps<{
            autocomplete: import("prop-types").Requireable<string>;
            container: import("prop-types").Requireable<string>;
            form: import("prop-types").Requireable<string>;
            root: import("prop-types").Requireable<string>;
            root_open: import("prop-types").Requireable<string>;
            search: import("prop-types").Requireable<string>;
        }>>;
        export { bool as isOpen };
    }
}
import { bool } from "prop-types";

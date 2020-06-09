export default SearchPage;
declare function SearchPage(props: any): JSX.Element;
declare namespace SearchPage {
    export namespace propTypes {
        export const classes: import("prop-types").Requireable<import("prop-types").InferProps<{
            noResult: import("prop-types").Requireable<string>;
            root: import("prop-types").Requireable<string>;
            totalPages: import("prop-types").Requireable<string>;
        }>>;
    }
}

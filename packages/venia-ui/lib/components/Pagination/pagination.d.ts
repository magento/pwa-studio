export default Pagination;
declare function Pagination(props: any): JSX.Element;
declare namespace Pagination {
    export namespace propTypes {
        export const classes: import("prop-types").Requireable<import("prop-types").InferProps<{
            root: import("prop-types").Requireable<string>;
        }>>;
        export const pageControl: import("prop-types").Validator<import("prop-types").InferProps<{
            currentPage: import("prop-types").Requireable<number>;
            setPage: import("prop-types").Requireable<(...args: any[]) => any>;
            totalPages: import("prop-types").Requireable<number>;
        }>>;
    }
}

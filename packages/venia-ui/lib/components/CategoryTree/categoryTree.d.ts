export default Tree;
declare function Tree(props: any): JSX.Element;
declare namespace Tree {
    export namespace propTypes {
        export const categories: import("prop-types").Requireable<{
            [x: string]: import("prop-types").InferProps<{
                id: import("prop-types").Validator<number>;
                name: import("prop-types").Requireable<string>;
            }>;
        }>;
        export const categoryId: import("prop-types").Validator<number>;
        export const classes: import("prop-types").Requireable<import("prop-types").InferProps<{
            root: import("prop-types").Requireable<string>;
            tree: import("prop-types").Requireable<string>;
        }>>;
        export const onNavigate: import("prop-types").Validator<(...args: any[]) => any>;
        export const setCategoryId: import("prop-types").Validator<(...args: any[]) => any>;
        export const updateCategories: import("prop-types").Validator<(...args: any[]) => any>;
    }
}

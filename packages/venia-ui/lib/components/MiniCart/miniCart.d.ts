export default MiniCart;
declare function MiniCart(props: any): JSX.Element;
declare namespace MiniCart {
    export namespace propTypes {
        export const classes: import("prop-types").Requireable<import("prop-types").InferProps<{
            header: import("prop-types").Requireable<string>;
            root: import("prop-types").Requireable<string>;
            root_open: import("prop-types").Requireable<string>;
            title: import("prop-types").Requireable<string>;
        }>>;
    }
}

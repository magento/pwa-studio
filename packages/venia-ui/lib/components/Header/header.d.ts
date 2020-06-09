export default Header;
declare function Header(props: any): JSX.Element;
declare namespace Header {
    export namespace propTypes {
        export const classes: import("prop-types").Requireable<import("prop-types").InferProps<{
            closed: import("prop-types").Requireable<string>;
            logo: import("prop-types").Requireable<string>;
            open: import("prop-types").Requireable<string>;
            primaryActions: import("prop-types").Requireable<string>;
            secondaryActions: import("prop-types").Requireable<string>;
            toolbar: import("prop-types").Requireable<string>;
        }>>;
    }
}

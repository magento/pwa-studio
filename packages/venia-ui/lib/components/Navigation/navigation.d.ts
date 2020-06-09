export default Navigation;
declare function Navigation(props: any): JSX.Element;
declare namespace Navigation {
    export namespace propTypes {
        export const classes: import("prop-types").Requireable<import("prop-types").InferProps<{
            body: import("prop-types").Requireable<string>;
            form_closed: import("prop-types").Requireable<string>;
            form_open: import("prop-types").Requireable<string>;
            footer: import("prop-types").Requireable<string>;
            header: import("prop-types").Requireable<string>;
            root: import("prop-types").Requireable<string>;
            root_open: import("prop-types").Requireable<string>;
            signIn_closed: import("prop-types").Requireable<string>;
            signIn_open: import("prop-types").Requireable<string>;
            isRoot: import("prop-types").Requireable<string>;
        }>>;
    }
}

export default NavButton;
declare function NavButton(props: any): JSX.Element;
declare namespace NavButton {
    export namespace propTypes {
        export const classes: import("prop-types").Requireable<import("prop-types").InferProps<{
            icon: import("prop-types").Requireable<string>;
            icon_disabled: import("prop-types").Requireable<string>;
            root: import("prop-types").Requireable<string>;
        }>>;
    }
    export namespace defaultProps {
        export const buttonLabel: string;
    }
}

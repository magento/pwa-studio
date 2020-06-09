export default Footer;
declare function Footer(props: any): JSX.Element;
declare namespace Footer {
    export namespace propTypes {
        export const classes: import("prop-types").Requireable<import("prop-types").InferProps<{
            copyright: import("prop-types").Requireable<string>;
            root: import("prop-types").Requireable<string>;
            tile: import("prop-types").Requireable<string>;
            tileBody: import("prop-types").Requireable<string>;
            tileTitle: import("prop-types").Requireable<string>;
        }>>;
    }
}

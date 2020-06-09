export default Logo;
/**
 * A component that renders a logo in the header.
 */
export type Logo = any;
/**
 * Props for {@link Logo}
 */
export type props = {
    /**
     * An object containing the class names for the
     * Logo component.
     */
    classes: {
        logo: string;
    };
    /**
     * the height of the logo.
     */
    height: number;
};
/**
 * A component that renders a logo in the header.
 *
 * @typedef Logo
 * @kind functional component
 *
 * @param {props} props React component props
 *
 * @returns {React.Element} A React component that displays a logo.
 */
declare function Logo(props: props): any;
declare namespace Logo {
    export namespace propTypes {
        export const classes: PropTypes.Requireable<PropTypes.InferProps<{
            logo: PropTypes.Requireable<string>;
        }>>;
        export const height: PropTypes.Requireable<number>;
        export const width: PropTypes.Requireable<number>;
    }
    export namespace defaultProps {
        const height_1: number;
        export { height_1 as height };
        const width_1: number;
        export { width_1 as width };
    }
}
import PropTypes from "prop-types";

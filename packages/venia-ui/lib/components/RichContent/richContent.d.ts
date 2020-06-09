export default RichContent;
/**
 * RichContent component.
 *
 * This component serves as the pool to determine which type of content is being rendered
 * and pass the data off to the correct system.
 */
export type RichContent = any;
/**
 * Props for {@link RichContent}
 */
export type props = {
    /**
     * An object containing the class names for the RichContent
     */
    classes: {
        root: string;
    };
    /**
     * Content
     */
    html: string;
};
/**
 * RichContent component.
 *
 * This component serves as the pool to determine which type of content is being rendered
 * and pass the data off to the correct system.
 *
 * @typedef RichContent
 * @kind functional component
 *
 * @param {Object} props React component props
 *
 * @returns {React.Element} A React component that renders Heading with optional styling properties.
 */
declare function RichContent(props: any): any;
declare namespace RichContent {
    export namespace propTypes {
        export const classes: import("prop-types").Requireable<import("prop-types").InferProps<{
            root: import("prop-types").Requireable<string>;
        }>>;
        export { string as html };
    }
}
import { string } from "prop-types";

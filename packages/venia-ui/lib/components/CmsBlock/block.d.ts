export default Block;
/**
 * CMS Block component.
 */
export type Block = any;
/**
 * Props for {@link Block}
 */
export type props = {
    /**
     * Rich content of the block
     */
    content: string;
};
/**
 * CMS Block component.
 *
 * @typedef Block
 * @kind functional component
 *
 * @param {props} props React component props
 *
 * @returns {React.Element} A React component that displays a CMS Block.
 */
declare function Block({ content }: props): any;
declare namespace Block {
    export namespace propTypes {
        export { string as content };
    }
}
import { string } from "prop-types";

export default Tile;
declare function Tile(props: any): JSX.Element;
declare namespace Tile {
    export namespace propTypes {
        export { bool as hasFocus };
        export { bool as isSelected };
        export const item: import("prop-types").Validator<import("prop-types").InferProps<{
            label: import("prop-types").Validator<string>;
            value_index: import("prop-types").Validator<string | number>;
        }>>;
        export const onClick: import("prop-types").Validator<(...args: any[]) => any>;
    }
    export namespace defaultProps {
        export const hasFocus: boolean;
        export const isSelected: boolean;
    }
}
import { bool } from "prop-types";

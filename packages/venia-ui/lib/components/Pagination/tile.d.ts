export default Tile;
declare function Tile(props: any): JSX.Element;
declare namespace Tile {
    export const propTypes: {
        classes: import("prop-types").Requireable<import("prop-types").InferProps<{
            root: import("prop-types").Requireable<string>;
            root_active: import("prop-types").Requireable<string>;
        }>>;
        isActive: import("prop-types").Requireable<boolean>;
        number: import("prop-types").Requireable<number>;
        onClick: import("prop-types").Requireable<(...args: any[]) => any>;
    };
}

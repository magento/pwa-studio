export default Quantity;
declare function Quantity(props: any): JSX.Element;
declare namespace Quantity {
    export namespace propTypes {
        export const classes: import("prop-types").Requireable<import("prop-types").InferProps<{
            root: import("prop-types").Requireable<string>;
        }>>;
        export const items: import("prop-types").Requireable<import("prop-types").InferProps<{
            value: import("prop-types").Requireable<number>;
        }>[]>;
    }
    export namespace defaultProps {
        export const selectLabel: string;
    }
}

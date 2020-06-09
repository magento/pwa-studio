export default ErrorView;
declare function ErrorView(props: any): JSX.Element;
declare namespace ErrorView {
    export namespace propTypes {
        export const children: PropTypes.Validator<PropTypes.ReactNodeLike>;
        export const classes: PropTypes.Requireable<PropTypes.InferProps<{
            root: PropTypes.Requireable<string>;
        }>>;
    }
}
import PropTypes from "prop-types";

export default AccountLink;
declare function AccountLink(props: any): JSX.Element;
declare namespace AccountLink {
    export namespace propTypes {
        export const children: import("prop-types").Validator<import("prop-types").ReactNodeLike[]>;
        export const classes: import("prop-types").Requireable<import("prop-types").InferProps<{
            content: import("prop-types").Requireable<string>;
            icon: import("prop-types").Requireable<string>;
            root: import("prop-types").Requireable<string>;
            root_highPriority: import("prop-types").Requireable<string>;
            root_lowPriority: import("prop-types").Requireable<string>;
            root_normalPriority: import("prop-types").Requireable<string>;
            text: import("prop-types").Requireable<string>;
        }>>;
        export { func as onClick };
    }
}
import { func } from "prop-types";

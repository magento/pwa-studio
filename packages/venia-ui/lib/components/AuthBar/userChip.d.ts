export default UserChip;
declare function UserChip(props: any): JSX.Element;
declare namespace UserChip {
    export namespace propTypes {
        export const classes: import("prop-types").Requireable<import("prop-types").InferProps<{
            email: import("prop-types").Requireable<string>;
            fullName: import("prop-types").Requireable<string>;
            icon: import("prop-types").Requireable<string>;
            root: import("prop-types").Requireable<string>;
            user: import("prop-types").Requireable<string>;
        }>>;
        export const showMyAccount: import("prop-types").Validator<(...args: any[]) => any>;
        export const user: import("prop-types").Requireable<import("prop-types").InferProps<{
            email: import("prop-types").Requireable<string>;
            firstname: import("prop-types").Requireable<string>;
            lastname: import("prop-types").Requireable<string>;
        }>>;
    }
}

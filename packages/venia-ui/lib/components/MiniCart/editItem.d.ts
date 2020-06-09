export default EditItem;
declare function EditItem(props: any): JSX.Element;
declare namespace EditItem {
    export namespace propTypes {
        export { string as currencyCode };
        export { func as endEditItem };
        export { bool as isUpdatingItem };
        export const item: import("prop-types").Validator<object>;
    }
}
import { string } from "prop-types";
import { func } from "prop-types";
import { bool } from "prop-types";

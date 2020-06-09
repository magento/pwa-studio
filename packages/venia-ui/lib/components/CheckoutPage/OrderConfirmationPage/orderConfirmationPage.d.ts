export default OrderConfirmationPage;
declare function OrderConfirmationPage(props: any): JSX.Element;
declare namespace OrderConfirmationPage {
    export namespace propTypes {
        export const classes: import("prop-types").Requireable<import("prop-types").InferProps<{
            addressStreet: import("prop-types").Requireable<string>;
            mainContainer: import("prop-types").Requireable<string>;
            heading: import("prop-types").Requireable<string>;
            orderNumber: import("prop-types").Requireable<string>;
            shippingInfoHeading: import("prop-types").Requireable<string>;
            shippingInfo: import("prop-types").Requireable<string>;
            email: import("prop-types").Requireable<string>;
            name: import("prop-types").Requireable<string>;
            addressAdditional: import("prop-types").Requireable<string>;
            shippingMethodHeading: import("prop-types").Requireable<string>;
            shippingMethod: import("prop-types").Requireable<string>;
            itemsReview: import("prop-types").Requireable<string>;
            additionalText: import("prop-types").Requireable<string>;
            sidebarContainer: import("prop-types").Requireable<string>;
        }>>;
        export const data: import("prop-types").Validator<object>;
        export { string as orderNumber };
    }
}
import { string } from "prop-types";

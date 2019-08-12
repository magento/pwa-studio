import actions from './actions';
import { orderDetailsRequest } from './restApi';

//TODO: implement right restApi or use another solution
//TODO: once moving from PurchaseHistory to particular PurchaseDetails page is available,
//double-check argument passed to restApi
export const fetchOrderDetails = ({ orderId, itemId } = {}) =>
    async function thunk(dispatch) {
        dispatch(actions.request({ orderId, itemId }));

        try {
            const response = await orderDetailsRequest({ orderId });
            dispatch(actions.receive(response));
        } catch (error) {
            dispatch(actions.receive(error));
        }
    };

import { RestApi } from '@magento/peregrine';
import purchaseHistoryMock from './mocks/purchaseHistoryMock';

const { request } = RestApi.Magento2;

const API_BASE = `/rest/V1`;

export const addItemToGuestCart = cartItem =>
    request(`${API_BASE}/guest-carts/${cartItem.quote_id}/items`, {
        method: 'POST',
        body: JSON.stringify({
            cartItem
        })
    });

// TODO: implement method.
export const fetchPurchaseHistory = () =>
    new Promise(resolve => {
        setTimeout(() => resolve(purchaseHistoryMock), 1000);
    });

const restService = {};

restService.api = {
    addItemToGuestCart,
    fetchPurchaseHistory
};

export default restService;

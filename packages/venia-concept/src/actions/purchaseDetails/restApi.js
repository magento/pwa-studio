import {
    itemMock,
    otherItemsMock,
    orderDetailsMock
} from './itemsAndOrderDetailsMocks';
//TODO: implement right restApi or use another solution

export const orderDetailsRequest = () =>
    new Promise(resolve => {
        setTimeout(() => {
            resolve({
                item: itemMock,
                otherItems: otherItemsMock,
                orderDetails: orderDetailsMock
            });
        }, 1000);
    });

export function beginCheckout(): (dispatch: any) => Promise<void>;
export function cancelCheckout(): (dispatch: any) => Promise<void>;
export function resetCheckout(): (dispatch: any) => Promise<void>;
export function resetReceipt(): (dispatch: any) => Promise<void>;
export function submitPaymentMethodAndBillingAddress(payload: any): (dispatch: any) => Promise<[any, any]>;
export function submitBillingAddress(payload: any): (dispatch: any, getState: any) => Promise<void>;
export function submitPaymentMethod(payload: any): (dispatch: any, getState: any) => Promise<void>;
export function submitShippingAddress(payload?: {}): (dispatch: any, getState: any) => Promise<void>;
export function submitShippingMethod(payload: any): (dispatch: any, getState: any) => Promise<void>;
export function submitOrder({ fetchCartId }: {
    fetchCartId: any;
}): (dispatch: any, getState: any) => Promise<void>;
export function createAccount({ history }: {
    history: any;
}): (dispatch: any, getState: any) => Promise<void>;
export function formatAddress(address?: object, countries?: object[]): any;
export function clearCheckoutDataFromStorage(): Promise<void>;
